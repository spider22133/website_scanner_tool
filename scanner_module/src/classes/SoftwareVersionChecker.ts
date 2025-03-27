import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import { BaramundiApi } from './BaramundiApi'
import { WingetUtils } from './WingetApi'
import { SoftwareType } from '@/types/baramundi'
import SoftwareUpdateNotifier from './SoftwareUpdateNotifier'

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
      for (const software of findAllSoftwaresData) {
        await this.checkSoftwareVersion(software)
      }

      this.socket.emit('updateSoftware', 'changed')
    } catch (error) {
      console.log(error)
    }
  }

  public async checkSoftwareVersion(item: SoftwareModel): Promise<{ software?: SoftwareModel; message?: string }> {
    try {
      let updatedSoftware: SoftwareModel = item

      // Fetch and update the software version if necessary
      const { software, isUpdated } = await this.updateSoftwareVersion(updatedSoftware)
      updatedSoftware = software

      // Retrieve Baramundi application details
      const { hasCurrentVersion, currentBaramundiAppId } = await this.findCurrentBaramundiApp(updatedSoftware)

      // If no current version is found, return an update message
      if (!currentBaramundiAppId && !hasCurrentVersion) {
        return { message: `Update required for ${updatedSoftware.name} - Current version ${updatedSoftware.version} not found` }
      }

      // Update software only if a valid application ID exists
      if (currentBaramundiAppId) {
        updatedSoftware = await this.updateSoftwareFromBaramundi(updatedSoftware, currentBaramundiAppId, isUpdated)
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
  private async updateSoftwareVersion(software: SoftwareModel): Promise<{ software: SoftwareModel; isUpdated: boolean }> {
    let isUpdated = false
    const packageDetails = await WingetUtils.showSoftware(software.winget_id)

    if (packageDetails.version !== software.version) {
      isUpdated = true
      return {
        software: await this.softwareService.updateSoftware(software.winget_id, {
          ...software,
          version: packageDetails.version,
        }),
        isUpdated,
      }
    }

    return { software, isUpdated }
  }

  /**
   * Searches for the current version of the application in Baramundi.
   */
  public async findCurrentBaramundiApp(software: SoftwareModel): Promise<{ hasCurrentVersion: boolean; currentBaramundiAppId?: string }> {
    let hasCurrentVersion = false
    let currentBaramundiAppId: string | undefined

    const resultAppList = await this.baramundi.findApplicationByName(software.name)

    for (const app of resultAppList) {
      if (/Aktuell\b/i.test(app.Name)) {
        currentBaramundiAppId = app.Id
      }
      if (app.Name.includes(software.version)) {
        hasCurrentVersion = true
      }
    }

    return { hasCurrentVersion, currentBaramundiAppId }
  }

  /**
   * Updates software details from Baramundi if an application ID is available.
   */
  public async updateSoftwareFromBaramundi(software: SoftwareModel, appId: string, webexVersionUpdated: boolean): Promise<SoftwareModel> {
    const resultAppByID: SoftwareType = await this.baramundi.getApplicationById(appId)
    let updatedSoftware = software

    if (resultAppByID) {
      updatedSoftware = await this.softwareService.updateSoftware(software.winget_id, {
        ...software,
        bara_version: resultAppByID.Version,
        is_current: software.version === resultAppByID.Version,
      })
    }

    if (!updatedSoftware.is_current && webexVersionUpdated) {
      this.notifier.sendDailySoftwareUpdates(process.env.WEBEX_CHAT_ID)
    }

    return updatedSoftware
  }
}

export default SoftwareVersionChecker
