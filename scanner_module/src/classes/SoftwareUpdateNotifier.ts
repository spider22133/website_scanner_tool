import dayjs from 'dayjs'
import WebexBot from './api/WebexNodeBotFramework'
import { SoftwareModel } from '@/models/software.model'
import SoftwareService from '@/services/software.service'
import { logger } from '@/utils/logger'
import UserService from '@/services/users.service'
import { UserModel } from '@/models/user.model'
import { User } from '@/interfaces/user.interface'

// Define constants for date formats to avoid repetition
const DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD.MM.'
const TIME_FORMAT = 'HH:mm'
const FULL_TIMESTAMP_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss Z'

class SoftwareUpdateNotifier {
  private readonly webexBot: WebexBot
  private softwareService: SoftwareService
  private userService: UserService = new UserService()

  constructor(webexBot: WebexBot) {
    this.webexBot = webexBot
  }

  public setSoftwareService(softwareService: SoftwareService): void {
    if (!softwareService) {
      throw new Error('SoftwareService cannot be null or undefined')
    }
    this.softwareService = softwareService
  }

  public async sendDailySoftwareUpdates(roomId: string): Promise<void> {
    try {
      const allSoftwareUpdates = await this.softwareService.findAllSoftware()
      const todaysUpdates = await this.getTodaysUpdates(allSoftwareUpdates)

      if (todaysUpdates?.length === 0) {
        logger.info('ℹ️ Keine Software-Updates für heute gefunden.')
        return
      }

      const message = await this.formatSoftwareUpdateMessage(todaysUpdates)
      if (message) {
        this.webexBot.sendMessage(roomId, message)
      } else {
        logger.info('ℹ️ Keine relevanten Updates zum Senden.')
      }
    } catch (error) {
      logger.error('❌ Fehler beim Senden der Software-Update-Nachricht:', error)
      throw error // Re-throw for upstream handling if needed
    }
  }

  private async getTodaysUpdates(updates: SoftwareModel[]): Promise<SoftwareModel[]> {
    const today = dayjs().format(DATE_FORMAT)
    const results: SoftwareModel[] = updates.filter(item => !item.is_current)
    let hasUpdate = false

    await Promise.all(
      results.map(async software => {
        const latestVersion = await software.getLastVersion()

        if (latestVersion && dayjs(latestVersion.updatedAt).format(DATE_FORMAT) === today) {
          hasUpdate = true
        }
      }),
    )

    if (hasUpdate) {
      return results.filter((software): software is SoftwareModel => software !== null)
    }

    return []
  }

  private async formatSoftwareUpdateMessage(updates: SoftwareModel[]): Promise<string | null> {
    if (updates.length === 0) {
      return null
    }

    const header = `**🆕 NON-MSW Changelog**`
    const tableHeader = [
      '| Nr. | Datum | Uhrzeit (MESZ) | Produkt | Version | Verantwortlich |',
      '|----|-------|----------------|---------|---------|----------------|',
    ].join('\n')

    // Fetch all versions and process them
    const sortedUpdates = await this.getSortedUpdates(updates)

    if (sortedUpdates.length === 0) {
      return null
    }

    // Generate table rows asynchronously
    const tableRows = await Promise.all(
      sortedUpdates.reverse().map(async (item, index) => {
        const { software, date, time } = item
        const version = software.version || 'N/A'
        const name = software.name || 'Unbekannt'
        const responsibleId = software.user_id

        let responsibleName = 'Unbekannt'
        if (responsibleId) {
          try {
            const responsible = await this.userService.findUserById(responsibleId)
            responsibleName = `${responsible.firstName} ${responsible.lastName}`
          } catch (error) {
            responsibleName = 'Nicht gefunden'
          }
        }

        return `| ${sortedUpdates.length - index} | ${dayjs(date).format(
          DISPLAY_DATE_FORMAT,
        )} | ${time} | ${name} | ${version} | ${responsibleName} |`
      }),
    )

    return [header, '', 'Hier sind die neuesten Software-Updates für heute:', '', tableHeader, ...tableRows, ''].join('\n')
  }

  // Helper function to get sorted updates
  private async getSortedUpdates(updates: SoftwareModel[]): Promise<{ software: SoftwareModel; date: Date; time: string }[]> {
    const updatesWithVersions = await Promise.all(
      updates.map(async software => {
        const latestVersion = await software.getLastVersion()
        if (latestVersion) {
          const time = dayjs(latestVersion.updatedAt).format(TIME_FORMAT)
          return { software, date: latestVersion.updatedAt, time }
        }
        return null
      }),
    )

    // Filter out null values and sort by date and time
    const validUpdates = updatesWithVersions.filter(item => item !== null) as { software: SoftwareModel; date: Date; time: string }[]

    return validUpdates.sort((a, b) => {
      // Sort first by date, then by time if the dates are equal
      const dateDiff = dayjs(b.date).isBefore(dayjs(a.date)) ? 1 : -1
      if (dateDiff === -1) {
        return dayjs(b.time).isBefore(dayjs(a.time)) ? 1 : -1
      }
      return dateDiff
    })
  }
}

export default SoftwareUpdateNotifier
