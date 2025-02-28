import { exec } from 'child_process'
import { promisify } from 'util'
import { WingetPackageDetails, WinGetSoftwareEntry } from '../../../types/common'
import { logger } from '@utils/logger'

const execAsync = promisify(exec)

export class WingetUtils {
  private static async execWingetCommand(command: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command)
      if (stderr) logger.error(`winget stderr: ${stderr}`)

      return stdout
    } catch (error) {
      logger.error(`Command failed: ${command} - ${(error as Error).message}`)
      throw error
    }
  }

  public static async showSoftware(packageId: string): Promise<WingetPackageDetails | null> {
    try {
      const stdout = await this.execWingetCommand(`winget show --id ${packageId}`)
      console.log(stdout)
      return this.parseShowOutput(stdout)
    } catch (error) {
      return null
    }
  }

  public static async searchSoftware(query: string): Promise<WinGetSoftwareEntry[]> {
    try {
      const stdout = await this.execWingetCommand(`winget search --name "${query.trim()}"`)
      return this.parseSoftwareTable(stdout)
    } catch (error) {
      logger.error(`Search failed: ${(error as Error).message}`)
      return []
    }
  }

  private static parseSoftwareTable(input: string): WinGetSoftwareEntry[] {
    const lines = input.split('\n').slice(2) // Skip header lines

    let entries: WinGetSoftwareEntry[] = []

    for (const line of lines) {
      // Split by whitespace, but preserve content after the version (e.g., "Tag: docker")
      const parts = line.trim().split(/\s+/)
      if (parts.length < 3) continue // Skip malformed lines

      const nameParts = []
      let i = 0
      // Name can have multiple words, so collect until we hit the ID (which has dots or specific format)
      while (i < parts.length && !parts[i].includes('.') && parts[i] !== 'Unknown') {
        nameParts.push(parts[i])
        i++
      }
      const name = nameParts.join(' ')
      const winget_id = parts[i] || ''
      const version = parts[i + 1] || 'Unknown'
      const source = parts[parts.length - 1] || ''
      let match = parts.slice(i + 2, parts.length - 1).join(' ') || undefined

      // Clean up match field (remove if empty or just whitespace)
      if (match && match.trim() === '') match = undefined

      entries.push({
        name,
        winget_id,
        version,
        source,
      })
    }
    entries = entries.filter(entrie => entrie.source !== 'msstore')
    return entries
  }

  private static parseShowOutput(output: string): WingetPackageDetails {
    const lines = output
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    const entry: WingetPackageDetails = {
      installer: {},
    }

    let currentSection = ''

    const mapping: Record<string, keyof WingetPackageDetails> = {
      publisher: 'publisher',
      'publisher url': 'publisherUrl',
      'publisher support url': 'publisherSupportUrl',
      author: 'author',
      moniker: 'moniker',
      description: 'description',
      homepage: 'homepage',
      license: 'license',
      'license url': 'licenseUrl',
      'privacy url': 'privacyUrl',
      copyright: 'copyright',
      'copyright url': 'copyrightUrl',
    }

    const installerMapping: Record<string, keyof WingetPackageDetails['installer']> = {
      'installer type': 'type',
      'installer locale': 'locale',
      'installer url': 'url',
      'installer sha256': 'sha256',
      'release date': 'releaseDate',
      'offline distribution supported': 'offlineSupported',
    }

    for (const line of lines) {
      if (line.startsWith('Installer:')) {
        currentSection = 'installer'
        continue
      }

      const [key, ...valueParts] = line.split(':')
      if (!key || valueParts.length === 0) continue

      const value = valueParts.join(':').trim()
      const keyFormatted = key.trim().toLowerCase()

      if (currentSection === 'installer') {
        const installerKey = installerMapping[keyFormatted]
        if (installerKey) {
          Object.assign(entry.installer, { [installerKey]: installerKey === 'offlineSupported' ? value.toLowerCase() === 'true' : value })
        }
      } else {
        const entryKey = mapping[keyFormatted]
        if (entryKey) {
          Object.assign(entry, { [entryKey]: value })
        }
      }
    }

    return entry
  }
}
