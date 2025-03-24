import Framework from 'webex-node-bot-framework'

class WebexBot {
  private framework: Framework

  constructor(token: string) {
    this.framework = new Framework({ token })
    this.initialize()
  }

  private initialize(): void {
    this.framework.start()

    this.framework.on('initialized', () => {
      console.log('Webex Framework initialized successfully!')
    })

    this.framework.on('spawn', bot => {
      console.log(`Bot is active in space: ${bot.room.title}`)
    })
  }

  public sendMessage(roomId: string, message: string): void {
    this.framework.bots.forEach(bot => {
      if (bot.room.id === roomId) {
        bot.say(message)
      }
    })
  }

  public stop(): void {
    console.log('Stopping Webex Framework...')
    this.framework.stop().then(() => {
      process.exit()
    })
  }
}

export default WebexBot
