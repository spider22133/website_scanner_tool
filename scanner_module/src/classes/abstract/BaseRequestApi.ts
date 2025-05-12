import axios, { AxiosRequestConfig, Method } from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import https from 'https'
import { logger } from '@/utils/logger'

export interface BaseCurlApiConfig {
  baseUrl: string
  username?: string
  password?: string
  token?: string
}

export abstract class BaseRequestApi {
  protected baseUrl: string
  protected token?: string
  protected username?: string
  protected password?: string

  constructor(config: BaseCurlApiConfig) {
    this.baseUrl = config.baseUrl
    this.username = config.username
    this.password = config.password
    this.token = config.token
  }

  protected async sendRequest(endpoint: string, method: Method = 'GET', data?: unknown): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const useProxy = Boolean(this.token) // if token is used, go through proxy
    const agent = useProxy ? new HttpsProxyAgent('http://ukd-proxy:80') : new https.Agent({ rejectUnauthorized: false })

    const axiosConfig: AxiosRequestConfig = {
      url,
      method,
      headers,
      httpsAgent: agent,
      proxy: false, // disable axios's built-in proxy detection
      ...(data && method !== 'GET' && { data }),
      ...(this.username &&
        this.password &&
        !this.token && {
          auth: {
            username: this.username,
            password: this.password,
          },
        }),
    }

    try {
      const response = await axios(axiosConfig)
      logger.info(`[Axios] ${method} ${url} → ${response.status}`)
      return response.data
    } catch (error: any) {
      logger.error(`❌ Axios ${method} request to ${url} failed.`)

      if (error.response) {
        logger.error(`Status: ${error.response.status}`)
        logger.error(`Response: ${JSON.stringify(error.response.data, null, 2)}`)
      } else if (error.request) {
        logger.error(`No response received. Request:`, error.request)
      } else {
        logger.error(`Request setup error: ${error.message}`)
      }

      logger.debug(`Full error: ${JSON.stringify(error, null, 2)}`)
      return null
    }
  }
}
