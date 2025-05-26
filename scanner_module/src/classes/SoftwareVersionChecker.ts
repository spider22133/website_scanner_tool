import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import { BaramundiApi } from './api/BaramundiApi'
import { WingetGitHubApi } from './api/WingetApi'
import { OrgUnitType, SoftwareType } from '@/types/baramundi'
import SoftwareUpdateNotifier from './SoftwareUpdateNotifier'
import semver from 'semver'
import { JiraIssueService } from '@/services/jira.service'

class SoftwareVersionChecker {
  private softwareService = new SoftwareService()
  private jiraService = new JiraIssueService()

  private notifier: SoftwareUpdateNotifier
  private socket: Socket
  private baramundi: BaramundiApi
  public wingetApi: WingetGitHubApi

  public connectWingetApi(api: WingetGitHubApi) {
    this.wingetApi = api
  }

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

      await this.wingetApi.updateManifests()

      for (const software of findAllSoftwaresData) {
        await this.checkSoftwareVersion(software)
      }

      await this.notifier.sendDailySoftwareUpdates(process.env.WEBEX_CHAT_ID)

      this.socket?.connected && this.socket.emit('updateSoftware', 'changed')
    } catch (error) {
      console.log(error)
    }
  }

  public async checkSoftwareVersion(software: SoftwareModel, single = false): Promise<{ software?: SoftwareModel; message?: string }> {
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

      if (single) await this.wingetApi.updateManifests()

      // Single check should also send notification, if baramundi version is to be updated.
      // single && (await this.notifier.sendDailySoftwareUpdates(process.env.WEBEX_CHAT_ID_DEV))

      // Reload Jira issues data
      await this.jiraService.reloadJiraIssuesForSoftware(software)

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
    // 1. Validate Winget ID
    if (!software.winget_id) {
      throw new Error(`Software ${software.name} does not have a winget_id.`)
    }

    // 2. Try fetching Winget data (and handle potential failure)
    const packageDetails = await this.wingetApi.showSoftware(software.winget_id)
    console.log(packageDetails)

    if (!packageDetails || !packageDetails.version) {
      throw new Error(`No version info found for Winget ID: ${software.winget_id}`)
    }

    if (packageDetails.version !== software.bara_version) {
      try {
        await this.jiraService.createJiraIssueForSoftware(software, '3')
      } catch (err) {
        console.error(`Failed to create Jira issue: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // 3. Check if main version is different
    if (packageDetails.version !== software.version) {
      return await this.softwareService.updateSoftware(
        software.id.toString(),
        {
          ...software.get({ plain: true }),
          version: packageDetails.version,
          is_current: false,
        },
        true,
      )
    }

    // 4. Version already matches — update details and mark current
    return await this.softwareService.updateSoftware(software.id.toString(), {
      ...software.get({ plain: true }),
      details: JSON.stringify(packageDetails),
      is_current: true,
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
      versions.sort((a, b) => this.wingetApi.compareVersions(a.version, b.version))

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
    const result: OrgUnitType = await this.baramundi.getOrgUnitById(resultAppByID.ParentId)
    let updatedSoftware = software

    if (resultAppByID) {
      updatedSoftware = await this.softwareService.updateSoftware(software.id.toString(), {
        ...software,
        bara_version: resultAppByID.Version,
        is_current: software.version === resultAppByID.Version,
        is_central_managed: result.HierarchyPath.includes('UKD\\APPS'),
      })
    }

    return updatedSoftware
  }
}

export default SoftwareVersionChecker
