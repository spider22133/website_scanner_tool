import dayjs from 'dayjs'
import WebexBot from './WebexNodeBotFramework'
import { SoftwareModel } from '@/models/software.model'
import SoftwareService from '@/services/software.service'

// Define constants for date formats to avoid repetition
const DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD.MM.'
const TIME_FORMAT = 'HH:mm'
const FULL_TIMESTAMP_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss Z'

class SoftwareUpdateNotifier {
  private readonly webexBot: WebexBot
  private softwareService: SoftwareService | null = null

  constructor(webexBot: WebexBot) {
    this.webexBot = webexBot
  }

  // Use explicit method to set service with null check
  public setSoftwareService(softwareService: SoftwareService): void {
    if (!softwareService) {
      throw new Error('SoftwareService cannot be null or undefined')
    }
    this.softwareService = softwareService
  }

  public async sendDailySoftwareUpdates(roomId: string): Promise<void> {
    if (!this.softwareService) {
      console.error('❌ SoftwareService not initialized')
      return
    }

    try {
      const allSoftwareUpdates = await this.softwareService.findAllSoftware()
      const todaysUpdates = this.getTodaysUpdates(allSoftwareUpdates)

      if (todaysUpdates.length === 0) {
        console.log('ℹ️ Keine Software-Updates für heute gefunden.')
        return
      }

      const message = this.formatSoftwareUpdateMessage(todaysUpdates)
      if (message) {
        this.webexBot.sendMessage(roomId, message)
      } else {
        console.log('ℹ️ Keine relevanten Updates zum Senden.')
      }
    } catch (error) {
      console.error('❌ Fehler beim Senden der Software-Update-Nachricht:', error)
      throw error // Re-throw for upstream handling if needed
    }
  }

  private getTodaysUpdates(updates: SoftwareModel[]): SoftwareModel[] {
    const today = dayjs().format(DATE_FORMAT)
    return updates.filter(software => dayjs(software.updatedAt).format(DATE_FORMAT) === today && !software.is_current)
  }

  private formatSoftwareUpdateMessage(updates: SoftwareModel[]): string | null {
    if (updates.length === 0) {
      return null
    }

    const timestamp = dayjs().format(FULL_TIMESTAMP_FORMAT)
    const header = `**🆕 NON-MSW Changelog - ${timestamp}**`

    // Improved table formatting with better readability
    const tableHeader = ['| Nr. | Datum | Uhrzeit (MESZ) | Produkt | Version |', '|-----|-------|----------------|---------|---------|'].join('\n')

    const tableRows = updates
      .map((software, index) => {
        const date = dayjs(software.updatedAt).format(DISPLAY_DATE_FORMAT)
        const time = dayjs(software.updatedAt).format(TIME_FORMAT)
        const name = software.name || 'Unbekannt'
        const version = software.version || 'N/A'
        return `| ${index + 1} | ${date} | ${time} | ${name} | ${version} |`
      })
      .join('\n')

    return [header, '', 'Hier sind die neuesten Software-Updates für heute:', '', tableHeader, tableRows, ''].join('\n')
  }
}

export default SoftwareUpdateNotifier
