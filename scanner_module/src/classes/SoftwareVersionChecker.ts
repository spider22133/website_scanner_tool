import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import { BaramundiApi } from './BaramundiApi'
import { WingetUtils } from './WingetApi'
import validateEnv from '@utils/validateEnv'
import { Software } from '@/interfaces/software.interface'
import { SoftwareType } from '@/types/baramundi'

class SoftwareVersionChecker {
  public softwareService = new SoftwareService()
  public softwareVersionService = new SoftwareVersionService()
  public socket: Socket

  private _baramundi: BaramundiApi

  public connectSocket = (socket: Socket) => {
    this.socket = socket
  }

  public connectBaramundiApi = (baramundi: BaramundiApi) => {
    this._baramundi = baramundi
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
      updatedSoftware = await this.updateSoftwareVersion(updatedSoftware)

      // Retrieve Baramundi application details
      const { hasCurrentVersion, currentBaramundiAppId } = await this.findCurrentBaramundiApp(updatedSoftware)

      // If no current version is found, return an update message
      if (!currentBaramundiAppId && !hasCurrentVersion) {
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
    const packageDetails = await WingetUtils.showSoftware(software.winget_id)

    if (packageDetails.version !== software.version) {
      return this.softwareService.updateSoftware(software.winget_id, {
        ...software,
        bara_version: packageDetails.version,
      })
    }

    return software
  }

  /**
   * Searches for the current version of the application in Baramundi.
   */
  private async findCurrentBaramundiApp(software: SoftwareModel): Promise<{ hasCurrentVersion: boolean; currentBaramundiAppId?: string }> {
    let hasCurrentVersion = false
    let currentBaramundiAppId: string | undefined

    const resultAppList = await this._baramundi.findApplicationByName(software.name)

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
  private async updateSoftwareFromBaramundi(software: SoftwareModel, appId: string): Promise<SoftwareModel> {
    const resultAppByID: SoftwareType = await this._baramundi.getApplicationById(appId)

    if (resultAppByID) {
      return this.softwareService.updateSoftware(software.winget_id, {
        ...software,
        bara_version: resultAppByID.Version,
        is_current: software.version === resultAppByID.Version,
      })
    }

    return software
  }
}

export default SoftwareVersionChecker
