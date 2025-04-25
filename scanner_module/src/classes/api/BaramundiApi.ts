// Endpoint in Baramundi suchen
// $searchResult = Invoke-RestMethod -Uri "$($api)/search?type=endpoint&term=G84-ADM-PC2" -Method Get -Credential $cred
// #Endpoint ID: 589CD721-47D2-44E8-92FD-C697D4A54914
// Endpoint laden
// $endpoint = Invoke-RestMethod -Uri "$($api)/endpoints?id=589CD721-47D2-44E8-92FD-C697D4A54914" -Method Get -Credential $cred
// const endpoint = '/bConnect/v1.1/Applications?orgUnit=E9E642B7-35C4-4F3B-9766-22AC2CC1AC4E'
// const endpoint = '/bConnect/v1.1/Applications?id=B3AFF2C5-2C2F-4DF5-895E-078AA929B972'

import util from 'util'
import { exec } from 'child_process'
import { BaramundiSearch, OrgUnitType, SoftwareType } from '@/types/baramundi'
import { logger } from '@/utils/logger'
import fs from 'fs'
import path from 'path'

const execPromise = util.promisify(exec) // Promisify exec for async/await

export class BaramundiApi {
  private baseUrl: string
  private username: string
  private password: string

  constructor(url: string, username: string, password: string) {
    this.baseUrl = url
    this.username = username
    this.password = password
  }

  private buildCurlCommand(endpoint: string, method: string = 'GET', data?: any): string {
    const url = `${this.baseUrl}${endpoint}`
    let curlCommand = `curl -v -k -u "${this.username}:${this.password}" -X ${method} "${url}"`

    if (data) {
      const jsonData = JSON.stringify(data).replace(/"/g, '\\"') // Escape quotes for curl
      curlCommand += ` -H "Content-Type: application/json" -d "${jsonData}"`
    }

    return curlCommand
  }

  private async sendRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const curlCommand = this.buildCurlCommand(endpoint, method, data)

    try {
      const { stdout, stderr } = await execPromise(curlCommand, { maxBuffer: 1024 * 1024 * 1024 })
      const responseData = stdout.trim()

      try {
        return JSON.parse(responseData)
      } catch (parseError) {
        logger.error('Error parsing JSON:', parseError.message)
        return null
      }
    } catch (error) {
      logger.error(`Error executing ${method} request:`, error.message)

      if (error.stderr) {
        logger.error('curl stderr:', error.stderr)
      }
      return null
    }
  }

  public async findApplicationByName(term: string): Promise<BaramundiSearch[]> {
    const endpoint = `/bConnect/v1.1/Search?type=software&term=${encodeURIComponent(term)}`
    return await this.sendRequest(endpoint, 'GET')
  }

  public async getApplicationById(id: string): Promise<SoftwareType> {
    const endpoint = `/bConnect/v1.1/Applications?id=${id}`
    return await this.sendRequest(endpoint, 'GET')
  }

  public async getOrgUnitById(id: string): Promise<OrgUnitType> {
    const endpoint = `/bConnect/v1.1/OrgUnits?id=${id}`
    return await this.sendRequest(endpoint, 'GET')
  }

  public async downloadSoftwareScanRuleCountsXmlToFile(filename = 'software-scan-rule-counts.xml'): Promise<string | null> {
    const endpoint = `/bConnect/v1.1/softwarescanrulecounts.xml`
    const url = `${this.baseUrl}${endpoint}`
    const filePath = path.resolve('downloads', filename)

    // Sicherstellen, dass das downloads-Verzeichnis existiert
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const curlCommand = `curl -v -k -u "${this.username}:${this.password}" -X GET "${url}" -o "${filePath}"`

    try {
      const { stdout, stderr } = await execPromise(curlCommand)
      logger.info(`✅ XML file saved to ${filePath}`)
      return filePath
    } catch (error) {
      logger.error('❌ Error downloading XML file:', error.message)
      if (error.stderr) {
        logger.error('curl stderr:', error.stderr)
      }
      return null
    }
  }
}
