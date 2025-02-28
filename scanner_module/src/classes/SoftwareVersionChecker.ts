import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import mailer from '@utils/mailer'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

class SoftwareVersionChecker {
  public softwareService = new SoftwareService()
  public softwareVersionService = new SoftwareVersionService()
  public _socket: Socket

  public connectSocket = (socket: Socket) => {
    this._socket = socket
  }

  public async checkAllSoftware(): Promise<void> {
    try {
      const findAllSoftwaresData: SoftwareModel[] = await this.softwareService.findAllSoftwares()
      for (const software of findAllSoftwaresData) {
        // await this.checkSoftware(software)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async checkVersion(id: string) {
    return await SoftwareVersionChecker.checkSoftwareVersion(id)
  }

  private static async checkSoftwareVersion(id: string): Promise<{ status: number; msg: string }> {
    // try {
    //  const response = await fetch(url)
    //  const body = await response.text()
    //  const $ = cheerio.load(body)

    //  const versionMatch = $(mainSelector).text().match(new RegExp(pattern))
    //  const version = versionMatch ? versionMatch[0] : undefined

    //  console.info('Extracted Version:', version)
    //} catch (error) {
    //  console.log(error)
    //}

    return new Promise(() => ({ status: 200, msg: '' }))
  }
}

export default SoftwareVersionChecker
