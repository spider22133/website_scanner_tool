import { logger } from '@/utils/logger'
import Framework from 'webex-node-bot-framework'

class WebexBot {
  private framework: Framework
  public isInitialized = false

  constructor(token: string) {
    this.framework = new Framework({ token })
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
