import util from 'util'
import { exec } from 'child_process'
import { logger } from '@/utils/logger'

const execPromise = util.promisify(exec)

export interface BaseCurlApiConfig {
  baseUrl: string
  username: string
  password: string
}

export abstract class BaseCurlApi {
  protected baseUrl: string
  protected username: string
  protected password: string

  constructor(config: BaseCurlApiConfig) {
    this.baseUrl = config.baseUrl
    this.username = config.username
    this.password = config.password
  }

  protected buildCurlCommand(endpoint: string, method: string = 'GET', data?: any): string {
    const url = `${this.baseUrl}${endpoint}`
    let curlCommand = `curl -v -k -u "${this.username}:${this.password}" -X ${method} "${url}" -H "Content-Type: application/json; charset=utf-8"`

    if (data) {
      const jsonData = JSON.stringify(data).replace(/"/g, '\\"') // Escape quotes
      curlCommand += ` --data "${jsonData}"`
    }

    return curlCommand
  }

  protected async sendRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const curlCommand = this.buildCurlCommand(endpoint, method, data)

    try {
      const { stdout } = await execPromise(curlCommand, { maxBuffer: 1024 * 1024 * 1024 })
      const responseData = stdout.trim()

      try {
        return JSON.parse(responseData)
      } catch (parseError) {
        logger.error('Error parsing JSON:', parseError.message)
        logger.debug('Raw response:', responseData)
        return null
      }
    } catch (error: any) {
      logger.error(`Error executing ${method} request:`, error.message)

      if (error.stderr) {
        logger.error('curl stderr:', error.stderr)
      }
      return null
    }
  }
}
