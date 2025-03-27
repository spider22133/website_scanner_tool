import dayjs from 'dayjs'
import WebexBot from './WebexNodeBotFramework'
import { SoftwareModel } from '@/models/software.model'
import SoftwareService from '@/services/software.service'

class SoftwareUpdateNotifier {
  public webexBot: WebexBot
  private softwareService: SoftwareService

  constructor(webexBot: WebexBot) {
    this.webexBot = webexBot
  }

  public connectSoftwareService(softwareService: SoftwareService) {
    this.softwareService = softwareService
  }

  public async sendDailySoftwareUpdates(roomId: string): Promise<void> {
    try {
      const allSoftwareUpdates: SoftwareModel[] = await this.softwareService.findAllSoftware()

      // Filter updates for today
      const today = dayjs().format('YYYY-MM-DD')
      const todaysUpdates = allSoftwareUpdates.filter(software => dayjs(software.updatedAt).format('YYYY-MM-DD') === today)

      if (todaysUpdates.length === 0) {
        console.log('ℹ️ No software updates for today.')
        return
      }

      // Format the message
      const message = this.formatSoftwareUpdateMessage(todaysUpdates)

      // Send the message via Webex bot
      this.webexBot.sendMessage(roomId, message)
    } catch (error) {
      console.error('❌ Error sending software update message:', error)
    }
  }

  private formatSoftwareUpdateMessage(updates: SoftwareModel[]): string {
    const today = dayjs().format('YYYY-MM-DD')

    const filteredUpdates = updates
      .filter(software => dayjs(software.updatedAt).format('YYYY-MM-DD') === today)
      .filter(software => !software.is_current)

    if (filteredUpdates.length === 0) {
      return
    }

    const timestamp = `🕒 ${dayjs().format('ddd, DD MMM YYYY HH:mm:ss Z')}\n\n`
    const header = `**🆕 NON-MSW Changelog - ${timestamp}`
    const tableHeader = `| No. | Date | Time (MESZ) | Product | Version | Quantity |\n| --- | --- | --- | --- | --- | --- |\n`

    // Format each software entry as a table row
    const tableRows = filteredUpdates
      .map((software, index) => {
        return `| ${index + 1} | ${dayjs(software.updatedAt).format('DD.MM.')} | ${dayjs(software.updatedAt).format('HH:mm')} | ${software.name} | ${
          software.version
        } | '-' |`
      })
      .join('\n')

    return header + '\n\n' + tableHeader + tableRows
  }
}

export default SoftwareUpdateNotifier
