import { logger } from '@/utils/logger'
import Framework from 'webex-node-bot-framework'
import { BaseRequestApi, BaseCurlApiConfig } from '../abstract/BaseRequestApi'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

class WebexBot extends BaseRequestApi {
  private framework: Framework
  public isInitialized = false

  constructor(config: BaseCurlApiConfig) {
    super(config)
    this.framework = new Framework({ token: this.token })
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.info('ℹ️ Webex Framework already initialized')
      return Promise.resolve()
    }

    return new Promise(resolve => {
      this.framework.start()

      this.framework.on('initialized', () => {
        this.isInitialized = true
        logger.info('✅ Webex Framework initialized successfully!')
        resolve()
      })

      this.framework.on('spawn', bot => {
        logger.info(`🤖 Bot is active in space: ${bot.room.title}`)
      })
    })
  }

  public sendMessage(roomId: string, message: string): void {
    if (!this.isInitialized) {
      logger.warn('⚠️ WebexBot is not initialized yet.')
      return
    }

    this.framework.bots.forEach(bot => {
      if (bot.room.id === roomId) bot.say(message)
    })
  }

  /**
   * Sends raw markdown directly via Webex REST API.
   * Supports ASCII tables, code blocks, etc.
   */
  public async sendRawMarkdown(roomId: string, markdown: string): Promise<void> {
    try {
      await this.sendRequest('/messages', 'POST', { roomId, markdown })
    } catch (error) {
      logger.error('❌ Unknown error:', error)
    }
  }

  public async stop(): Promise<void> {
    logger.info('🛑 Stopping Webex Framework...')
    try {
      await this.framework.stop()
      logger.info('✅ Webex Framework stopped successfully')
      this.isInitialized = false
    } catch (error) {
      logger.error('❌ Error stopping Webex Framework:', error)
    }
  }
}

export default WebexBot
