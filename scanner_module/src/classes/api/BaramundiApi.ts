// Endpoint in Baramundi suchen
// $searchResult = Invoke-RestMethod -Uri "$($api)/search?type=endpoint&term=G84-ADM-PC2" -Method Get -Credential $cred
// #Endpoint ID: 589CD721-47D2-44E8-92FD-C697D4A54914
// Endpoint laden
// $endpoint = Invoke-RestMethod -Uri "$($api)/endpoints?id=589CD721-47D2-44E8-92FD-C697D4A54914" -Method Get -Credential $cred
// const endpoint = '/bConnect/v1.1/Applications?orgUnit=E9E642B7-35C4-4F3B-9766-22AC2CC1AC4E'
// const endpoint = '/bConnect/v1.1/Applications?id=B3AFF2C5-2C2F-4DF5-895E-078AA929B972'

import util from 'util'
import { exec } from 'child_process'
import { BaramundiSearch, SoftwareType } from '@/types/baramundi'
import { str } from 'envalid'
import { logger } from '@/utils/logger'

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

  // $name ='shotcut'
  // $searchResult = Invoke-RestMethod -Uri "$($api)/search?type=software&term=$($name)" -Method Get -Credential $cred

  // Invoke-RestMethod -Uri "$($api)/applications?id=ED5F5823-A823-4492-9DA7-BDCC8EC30E44" -Method Get -Credential $cred

  // 85C45562-51A7-4ED2-9153-CBFD75DF9CC9

  // Invoke-RestMethod -Uri "$($api)/OrgUnits?id=5B88BA48-5D8F-4054-A852-16DCA5A422FB" -Method Get -Credential $cred
}
