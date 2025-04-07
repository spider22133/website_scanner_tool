import { Client, SearchOptions } from 'ldapts'

export interface ADConfig {
  url: string
  baseDN: string
  bindDN: string
  bindPassword: string
}

export class ActiveDirectoryAuth {
  private client: Client
  private config: ADConfig

  constructor(config: ADConfig) {
    this.config = config
    this.client = new Client({ url: config.url })
  }

  async authenticate(userPrincipalName: string, password: string): Promise<boolean> {
    try {
      // 1. Bind with a service account
      await this.client.bind(this.config.bindDN, this.config.bindPassword)

      // 2. Search for the user's DN
      const searchOptions: SearchOptions = {
        scope: 'sub',
        filter: `(userPrincipalName=${userPrincipalName})`,
        attributes: ['dn'],
      }

      const { searchEntries } = await this.client.search(this.config.baseDN, searchOptions)

      if (searchEntries.length === 0) {
        console.warn(`User ${userPrincipalName} not found`)
        return false
      }

      const userDN = searchEntries[0].dn

      // 3. Try binding as the user to verify password
      await this.client.bind(userDN, password)
      return true
    } catch (error) {
      console.error(`AD Auth failed for ${userPrincipalName}:`, error)
      return false
    } finally {
      await this.client.unbind().catch(() => {})
    }
  }

  async findUser(userPrincipalName: string): Promise<Record<string, any> | null> {
    try {
      await this.client.bind(this.config.bindDN, this.config.bindPassword)

      const { searchEntries } = await this.client.search(this.config.baseDN, {
        scope: 'sub',
        filter: `(userPrincipalName=${userPrincipalName})`,
      })

      return searchEntries.length > 0 ? searchEntries[0] : null
    } catch (error) {
      console.error(`Error finding user ${userPrincipalName}:`, error)
      return null
    } finally {
      await this.client.unbind().catch(() => {})
    }
  }
}
