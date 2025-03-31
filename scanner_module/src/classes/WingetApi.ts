import { exec } from 'child_process'
import { promisify } from 'util'
import { WingetPackageDetails, SoftwareEntry } from '../../../types/common'
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
      return this.parseShowOutput(stdout)
    } catch (error) {
      return null
    }
  }

  public static async searchSoftware(query: string): Promise<SoftwareEntry[]> {
    try {
      const stdout = await this.execWingetCommand(`winget search --name "${query.trim()}"`)
      return this.parseSoftwareTable(stdout)
    } catch (error) {
      logger.error(`Search failed: ${(error as Error).message}`)
      return []
    }
  }

  private static parseSoftwareTable(input: string): SoftwareEntry[] {
    const lines = input.split('\n').slice(2) // Skip header lines

    const entries: SoftwareEntry[] = []

    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 4) continue // Skip malformed lines

      // Extract name (everything until we detect an ID, which should contain a dot)
      const nameParts = []
      let i = 0
      while (i < parts.length && !parts[i].includes('.') && parts[i] !== 'Unknown') {
        nameParts.push(parts[i])
        i++
      }

      const name = nameParts.join(' ')
      const winget_id = parts[i] || ''
      const version = parts[i + 1] || 'Unknown'
      const source = parts[i + 2] || ''

      // Only accept correctly formatted entries (ignores parsed headers)
      if (source !== 'winget' && source !== 'msstore') continue
      if (!winget_id.includes('.')) continue // Ensure ID format

      entries.push({
        name,
        winget_id,
        version,
        source,
      })
    }

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
    let isDescription = false
    let descriptionLines: string[] = []

    const mapping: Record<string, keyof WingetPackageDetails> = {
      version: 'version',
      publisher: 'publisher',
      'publisher url': 'publisherUrl',
      'publisher support url': 'publisherSupportUrl',
      author: 'author',
      description: 'description',
      homepage: 'homepage',
      license: 'license',
      'license url': 'licenseUrl',
      'privacy url': 'privacyUrl',
      copyright: 'copyright',
      'copyright url': 'copyrightUrl',
      'release notes': 'releaseNotes',
    }

    const installerMapping: Record<string, keyof WingetPackageDetails['installer']> = {
      'installer type': 'type',
      'installer locale': 'locale',
      'installer url': 'url',
      'installer sha256': 'sha256',
      'release date': 'releaseDate',
      'offline distribution supported': 'offlineSupported',
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('Installer:')) {
        currentSection = 'installer'
        isDescription = false
        continue
      }

      if (isDescription) {
        // Check if we've hit the next section header
        if (lines[i + 1]?.includes(':')) {
          isDescription = false
          entry.description = descriptionLines.join('\n')
        } else {
          descriptionLines.push(line)
          continue
        }
      }

      const [key, ...valueParts] = line.split(':')
      if (!key || valueParts.length === 0) continue

      const value = valueParts.join(':').trim()
      const keyFormatted = key.trim().toLowerCase()

      if (keyFormatted === 'description') {
        isDescription = true
        descriptionLines = [value]
        continue
      }

      if (currentSection === 'installer') {
        const installerKey = installerMapping[keyFormatted]
        if (installerKey) {
          Object.assign(entry.installer, {
            [installerKey]: installerKey === 'offlineSupported' ? value.toLowerCase() === 'true' : value,
          })
        }
      } else {
        const entryKey = mapping[keyFormatted]
        if (entryKey) {
          Object.assign(entry, { [entryKey]: value })
        }
      }
    }

    // Handle case where description is the last field
    if (isDescription) {
      entry.description = descriptionLines.join('\n')
    }

    return entry
  }
}
