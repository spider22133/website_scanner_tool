import Framework from 'webex-node-bot-framework'

class WebexBot {
  private framework: Framework
  public isInitialized = false

  constructor(token: string) {
    this.framework = new Framework({ token })
  }

  public async initialize(): Promise<void> {
    return new Promise(resolve => {
      this.framework.start()

      this.framework.on('initialized', () => {
        this.isInitialized = true
        console.log('✅ Webex Framework initialized successfully!')
        resolve()
      })

      this.framework.on('spawn', bot => {
        console.log(`🤖 Bot is active in space: ${bot.room.title}`)
      })
    })
  }

  public sendMessage(roomId: string, message: string): void {
    if (!this.isInitialized) {
      console.warn('⚠️ WebexBot is not initialized yet.')
      return
    }

    this.framework.bots.forEach(bot => {
      console.log(bot.room.id === roomId)
      if (bot.room.id === roomId) bot.say(message)
    })
  }

  public stop(): void {
    console.log('🛑 Stopping Webex Framework...')
    this.framework.stop().then(() => {
      process.exit()
    })
  }
}

export default WebexBot
