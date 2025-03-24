import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import { BaramundiApi } from './BaramundiApi'

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

  public async checkSoftwareVersion(item: SoftwareModel): Promise<{ status: number; message?: string }> {
    const resultAppList = await this._baramundi.findApplicationByName(item.name)

    let hasCurrentVersion = false
    let hasAktuell = false

    resultAppList.forEach(app => {
      console.log(app.Id, app.Name)
      if (app.Name.includes('Aktuell')) {
        hasAktuell = true
      }
      if (app.Name.includes(item.version)) {
        hasCurrentVersion = true
      }
    })

    if (!hasAktuell && !hasCurrentVersion) {
      return { status: 200, message: `Update required for ${item.name} - Current version ${item.version} not found` }
    }

    return { status: 200 }
  }
}

export default SoftwareVersionChecker
