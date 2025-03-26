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
    } catch (error) {
      console.log(error)
    }
  }

  public async checkSoftwareVersion(item: SoftwareModel): Promise<{ software?: SoftwareModel; message?: string }> {
    try {
      let hasCurrentVersion = false
      let currentBaramundiAppId: string | undefined
      let updatedSoftware: SoftwareModel = item

      // Fetch package details
      const packageDetails = await WingetUtils.showSoftware(updatedSoftware.winget_id)

      // Update software version if needed
      if (packageDetails.version !== updatedSoftware.version) {
        updatedSoftware = await this.softwareService.updateSoftware(updatedSoftware.winget_id, {
          ...updatedSoftware,
          bara_version: packageDetails.version,
        })
      }

      // Retrieve application list
      const resultAppList = await this._baramundi.findApplicationByName(updatedSoftware.name)

      for (const app of resultAppList) {
        if (/Aktuell\b/i.test(app.Name)) {
          currentBaramundiAppId = app.Id
        }
        if (app.Name.includes(updatedSoftware.version)) {
          hasCurrentVersion = true
        }
      }

      // If no current version is found, return an update message
      if (!currentBaramundiAppId && !hasCurrentVersion) {
        return { message: `Update required for ${updatedSoftware.name} - Current version ${updatedSoftware.version} not found` }
      }

      // Update software only if a valid application ID exists
      if (currentBaramundiAppId) {
        const resultAppByID: SoftwareType = await this._baramundi.getApplicationById(currentBaramundiAppId)
        if (resultAppByID) {
          updatedSoftware = await this.softwareService.updateSoftware(updatedSoftware.winget_id, {
            ...updatedSoftware,
            bara_version: resultAppByID.Version,
            is_current: updatedSoftware.version === resultAppByID.Version,
          })
        }
      }

      return { software: updatedSoftware }
    } catch (error) {
      console.error('Error in checkSoftwareVersion:', error)
      return { message: 'An error occurred while checking the software version' }
    }
  }
}

export default SoftwareVersionChecker
