import dayjs from 'dayjs'
import WebexBot from './api/WebexNodeBotFramework'
import { SoftwareModel } from '@/models/software.model'
import SoftwareService from '@/services/software.service'
import { logger } from '@/utils/logger'
import UserService from '@/services/users.service'

type SoftwareRow = {
  date: string
  name: string
  version: string
  baraVersion: string
  responsible: string
}

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

      const markdown = await this.formatSoftwareUpdateMessage(todaysUpdates)
      if (markdown) {
        //   this.webexBot.sendMessage(roomId, message)
        await this.webexBot.sendRawMarkdown(roomId, markdown)
      } else {
        logger.info('ℹ️ Keine relevanten Updates zum Senden.')
      }
    } catch (error) {
      logger.error('❌ Fehler beim Senden der Software-Update-Nachricht:', error)
      throw error // Re-throw for upstream handling if needed
    }
  }

  private async getTodaysUpdates(updates: SoftwareModel[]): Promise<SoftwareModel[]> {
    const results: SoftwareModel[] = updates.filter(item => !item.is_current)
    const updatedItems: SoftwareModel[] = []

    await Promise.all(
      results.map(async software => {
        const latestVersion = await software.getLastVersion()

        if (latestVersion) {
          updatedItems.push(software)
        }
      }),
    )

    return updatedItems
  }

  // private async formatSoftwareUpdateMessage(updates: SoftwareModel[]): Promise<string | null> {
  //   if (updates.length === 0) {
  //     return null
  //   }

  //   const header = `**🆕 NON-MSW Changelog**`
  //   const tableHeader = [
  //     '| Nr. | Datum  Produkt | Version | Baramundi V. | Verantwortlich |',
  //     '|----|-------|---------|---------|--------------|---------------|',
  //   ].join('\n')

  //   // Fetch all versions and process them
  //   const sortedUpdates = await this.getSortedUpdates(updates)

  //   if (sortedUpdates.length === 0) {
  //     return null
  //   }

  //   // Generate table rows asynchronously
  //   const tableRows = await Promise.all(
  //     sortedUpdates.reverse().map(async (item, index) => {
  //       const { software, date, time } = item
  //       const version = software.version || 'N/A'
  //       const baraVersion = software.bara_version || 'N/A'
  //       const name = software.name || 'Unbekannt'
  //       const responsibleId = software.user_id

  //       let responsibleName = 'Unbekannt'
  //       if (responsibleId) {
  //         try {
  //           const responsible = await this.userService.findUserById(responsibleId)
  //           responsibleName = `${responsible.firstName} ${responsible.lastName}`
  //         } catch (error) {
  //           responsibleName = 'Nicht gefunden'
  //         }
  //       }

  //       return `| ${sortedUpdates.length - index} | ${dayjs(date).format(
  //         DISPLAY_DATE_FORMAT,
  //       )} | ${name} | ${version} | ${baraVersion} | ${responsibleName} |`
  //     }),
  //   )

  //   return [header, '', 'Hier sind die neuesten Software-Updates für heute:', '', tableHeader, ...tableRows, ''].join('\n')
  // }

  // Helper function to get sorted updates

  private async formatSoftwareUpdateMessage(updates: SoftwareModel[]): Promise<string | null> {
    if (updates.length === 0) {
      return null
    }

    const sortedUpdates = await this.getSortedUpdates(updates)
    if (sortedUpdates.length === 0) {
      return null
    }

    const tableRows = await Promise.all(
      sortedUpdates.reverse().map(async item => {
        const { software, date } = item
        const softwareUser = await software.getPrimaryResponsible()
        const version = software.version || 'N/A'
        const baraVersion = software.bara_version || 'N/A'
        const name = software.name || 'Unbekannt'
        const responsibleId = softwareUser?.id

        let responsibleName = 'Unbekannt'
        if (responsibleId) {
          try {
            const responsible = await this.userService.findUserById(responsibleId)
            responsibleName = `${responsible.firstName} ${responsible.lastName}`
          } catch {
            responsibleName = 'Nicht gefunden'
          }
        }

        return {
          date: dayjs(date).format('DD.MM.'),
          name,
          version,
          baraVersion,
          responsible: responsibleName,
        }
      }),
    )

    const header = `🆕 **NON-MSW Changelog**`
    const intro = `Hier sind die neuesten Software-Updates für heute:`
    const asciiTable = this.generateAsciiTable(tableRows)

    return [header, '', intro, '```', asciiTable, '```'].join('\n')
  }

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

  private generateAsciiTable(rows: SoftwareRow[]): string {
    const headers = ['Nr.', 'Datum', 'Produkt', 'Version', 'Baramundi V.', 'Verantwortlich']
    const allRows = rows.map((row, i) => [`${rows.length - i}`, row.date, row.name, row.version, row.baraVersion, row.responsible])
    const table = [headers, ...allRows]

    const colWidths = headers.map((_, colIdx) => Math.max(...table.map(row => row[colIdx].length)))

    const hr = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+'

    const formatRow = (row: string[]) =>
      '| ' +
      row
        .map((cell, i) => cell.padEnd(colWidths[i], ' '))
        .map(cell => `${cell} `)
        .join('| ') +
      '|'

    const output = [hr, formatRow(headers), hr, ...allRows.map(formatRow), hr]

    return output.join('\n')
  }
}

export default SoftwareUpdateNotifier
