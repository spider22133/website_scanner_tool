import { exec } from 'child_process'
import { promisify } from 'util'
import { WingetPackageDetails, SoftwareEntry } from '../../../../types/common'
import { logger } from '@utils/logger'

const execAsync = promisify(exec)

export class WingetApiOld {
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
      return this.parsePackageDetailsFromMultilineOutput(stdout)
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

  private static parsePackageDetailsFromMultilineOutput(multilineOutput: string): any {
    const lines = multilineOutput.split('\n')
    const packageDetails: any = {
      installer: {},
    }

    let isParsingMultiLine = false
    let multiLineField = ''
    let multiLineContent: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/^PUSH MULTILINE:\s*/, '').trim()
      if (line === '') continue

      const colonIndex = line.indexOf(':')
      const key = colonIndex !== -1 ? line.slice(0, colonIndex).trim() : ''
      const value = colonIndex !== -1 ? line.slice(colonIndex + 1).trim() : ''

      // === Skip "Release Notes" completely ===
      if (key === 'Release Notes') {
        isParsingMultiLine = false
        multiLineField = ''
        multiLineContent = []
        continue
      }

      // === Handle Release Notes Url safely ===
      if (key === 'Release Notes Url') {
        packageDetails.releaseNotesUrl = value
        isParsingMultiLine = false
        continue
      }

      // === Multiline Top-level fields ===
      const knownTopLevelFields = [
        'Version',
        'Publisher',
        'Publisher Url',
        'Publisher Support Url',
        'Author',
        'Moniker',
        'Description',
        'Homepage',
        'License',
        'License Url',
        'Privacy Url',
        'Copyright',
        'Copyright Url',
        'Purchase Url',
        'Documentation',
      ]

      const knownInstallerFields = ['Installer Type', 'Installer Url', 'Installer SHA256', 'Release Date', 'Offline Distribution Supported']

      if (knownTopLevelFields.includes(key)) {
        if (isParsingMultiLine && multiLineField && multiLineContent.length > 0) {
          packageDetails[multiLineField] = multiLineContent.join('\n').trim()
        }

        isParsingMultiLine = true
        multiLineField = key.replace(/ /g, '').replace(/^./, c => c.toLowerCase())
        multiLineContent = value ? [value] : []
        continue
      }

      if (knownInstallerFields.includes(key)) {
        if (isParsingMultiLine && multiLineField && multiLineContent.length > 0) {
          packageDetails[multiLineField] = multiLineContent.join('\n').trim()
          isParsingMultiLine = false
          multiLineField = ''
          multiLineContent = []
        }

        const installerKey = key
          .replace(/Installer /, '')
          .replace(/ /g, '')
          .replace(/^./, c => c.toLowerCase())
        let parsedValue: any = value
        if (installerKey === 'offlineSupported') parsedValue = value.toLowerCase() === 'true'
        packageDetails.installer[installerKey] = parsedValue
        continue
      }

      // === Collect multiline content ===
      if (isParsingMultiLine) {
        multiLineContent.push(line)
      }
    }

    // === Final flush ===
    if (isParsingMultiLine && multiLineField && multiLineContent.length > 0) {
      packageDetails[multiLineField] = multiLineContent.join('\n').trim()
    }

    return packageDetails
  }
}
