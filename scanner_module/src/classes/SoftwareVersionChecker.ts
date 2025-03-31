import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import { BaramundiApi } from './BaramundiApi'
import { WingetUtils } from './WingetApi'
import { SoftwareType } from '@/types/baramundi'
import SoftwareUpdateNotifier from './SoftwareUpdateNotifier'
import semver from 'semver'

class SoftwareVersionChecker {
  private softwareService = new SoftwareService()
  private softwareVersionService = new SoftwareVersionService()

  private notifier: SoftwareUpdateNotifier
  private socket: Socket
  private baramundi: BaramundiApi

  public connectSocket = (socket: Socket) => {
    this.socket = socket
  }

  public connectBaramundiApi = (baramundi: BaramundiApi) => {
    this.baramundi = baramundi
  }

  public connectNotifier = (notifier: SoftwareUpdateNotifier) => {
    this.notifier = notifier
    this.notifier.setSoftwareService(this.softwareService)
  }

  public async checkAllSoftware(): Promise<void> {
    try {
      const findAllSoftwaresData: SoftwareModel[] = await this.softwareService.findAllSoftware()
      let notificationSent = false

      for (const software of findAllSoftwaresData) {
        const result = await this.checkSoftwareVersion(software)

        // Check if the software was updated and the notification has not been sent yet
        if (result.software && !result.software.is_current && !notificationSent) {
          this.notifier.sendDailySoftwareUpdates(process.env.WEBEX_CHAT_ID)
          notificationSent = true
        }
      }

      this.socket.emit('updateSoftware', 'changed')
    } catch (error) {
      console.log(error)
    }
  }

  public async checkSoftwareVersion(software: SoftwareModel): Promise<{ software?: SoftwareModel; message?: string }> {
    try {
      // Fetch and update the software version if necessary
      let updatedSoftware = await this.updateSoftwareVersion(software)

      // Retrieve Baramundi application details
      const { currentBaramundiAppId } = await this.findCurrentBaramundiApp(updatedSoftware)

      // If no current version is found, return an update message
      if (!currentBaramundiAppId) {
        return { message: `Update required for ${updatedSoftware.name} - Current version ${updatedSoftware.version} not found` }
      }

      // Update software only if a valid application ID exists
      if (currentBaramundiAppId) {
        updatedSoftware = await this.updateSoftwareFromBaramundi(updatedSoftware, currentBaramundiAppId)
      }

      return { software: updatedSoftware }
    } catch (error) {
      console.error('Error in checkSoftwareVersion:', error)
      return { message: 'An error occurred while checking the software version' }
    }
  }

  /**
   * Fetches package details and updates the software version if needed.
   */
  private async updateSoftwareVersion(software: SoftwareModel): Promise<SoftwareModel> {
    let isUpdated = false
    const packageDetails = await WingetUtils.showSoftware(software.winget_id)

    if (packageDetails.version !== software.version) {
      isUpdated = true
      return await this.softwareService.updateSoftware(software.winget_id, {
        ...software,
        version: packageDetails.version,
      })
    }

    return await this.softwareService.updateSoftware(software.winget_id, {
      ...software,
      details: JSON.stringify(packageDetails),
    })
  }

  /**
   * Searches for the current version of the application in Baramundi.
   */
  public async findCurrentBaramundiApp(software: SoftwareModel): Promise<{ currentBaramundiAppId?: string }> {
    let currentBaramundiAppId: string | undefined

    let resultAppList = await this.baramundi.findApplicationByName(software.name)
    resultAppList = resultAppList.filter(app => app.AdditionalInfo !== 'AppleMac')

    // Try to find the exact version first
    for (const app of resultAppList) {
      if (app.Name.includes(software.version)) {
        currentBaramundiAppId = app.Id
        return { currentBaramundiAppId }
      }
    }

    // Extract versions from app names
    const versions = resultAppList
      .map(app => {
        // Extract version patterns like "2024.12.1+563", "25.0.2-alpha", "25.0.0.1"
        const versionMatch = app.Name.match(/(\d+(\.\d+)*([a-zA-Z-+][\d]*)*)/)
        return versionMatch ? { id: app.Id, version: versionMatch[0] } : null
      })
      .filter((item): item is { id: string; version: string } => item !== null)

    if (versions.length > 0) {
      // Sort versions: first by semantic version comparison, then by natural order if semver fails
      versions.sort((a, b) => {
        const semverA = semver.coerce(a.version)
        const semverB = semver.coerce(b.version)

        if (semverA && semverB) {
          return semver.rcompare(semverA, semverB) // Use semver if valid
        }

        // Fallback to natural string comparison (case-insensitive, numeric aware)
        return b.version.localeCompare(a.version, undefined, { numeric: true, sensitivity: 'base' })
      })

      // Select the latest version
      currentBaramundiAppId = versions[0].id
    }

    return { currentBaramundiAppId }
  }
  /**
   * Updates software details from Baramundi if an application ID is available.
   */
  public async updateSoftwareFromBaramundi(software: SoftwareModel, appId: string): Promise<SoftwareModel> {
    const resultAppByID: SoftwareType = await this.baramundi.getApplicationById(appId)
    let updatedSoftware = software

    if (resultAppByID) {
      updatedSoftware = await this.softwareService.updateSoftware(software.winget_id, {
        ...software,
        bara_version: resultAppByID.Version,
        is_current: software.version === resultAppByID.Version,
      })
    }

    return updatedSoftware
  }
}

export default SoftwareVersionChecker
