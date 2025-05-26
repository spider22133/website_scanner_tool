import 'dotenv/config'
import path from 'path'
import { createServer, Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import express, { Application } from 'express'
import { initRoles } from '@models/role.model'

process.env['NODE_CONFIG_DIR'] = `${__dirname}/config`

import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { logger, stream } from '@utils/logger'
import errorMiddleware from '@middlewares/error.middleware'
import DB from '@databases'

import Routes from '@/interfaces/route.interface'

import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import TimerController from '@controllers/timer.controller'
import WebexBot from './classes/api/WebexNodeBotFramework'
import SoftwareUpdateNotifier from './classes/SoftwareUpdateNotifier'
import { BaramundiApi } from './classes/api/BaramundiApi'
import { WingetGitHubApi } from './classes/api/WingetApi'

class App {
  public app: Application
  public env: string
  public port: string | number
  public httpServer: HttpServer
  public io: Server

  public baramundi: BaramundiApi
  public webexBot?: WebexBot
  public softwareVersionChecker: SoftwareVersionChecker
  public timerController: TimerController

  constructor(routes: Routes[]) {
    this.env = process.env.NODE_ENV || 'development'
    this.port = process.env.PORT || 3000
    this.app = express()
    this.httpServer = createServer(this.app)
    this.io = new Server(this.httpServer, {
      cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
    })

    this.softwareVersionChecker = new SoftwareVersionChecker()
    this.timerController = TimerController.getInstance(this.softwareVersionChecker)

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    this.initializeErrorHandling()
    this.initializeExternalServices()
    this.initializeWebSocket()
    this.handleShutdown()

    this.timerController.run()
  }

  public async listen() {
    await this.connectToDatabase()
    this.httpServer.listen(this.port, () => {
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on port ${this.port}`)
    })
  }

  public getServer(): HttpServer {
    return this.httpServer
  }

  public addRoutes(routes: Routes[]) {
    this.initializeRoutes(routes)
  }

  private async connectToDatabase() {
    try {
      await DB.sequelize.sync({ alter: true })
      await initRoles()
      logger.info('✅ Database connected successfully')
    } catch (error) {
      logger.error('❌ Database connection failed:', error)
      process.exit(1)
    }
  }

  private initializeMiddlewares() {
    this.configureLogging()
    this.configureCors()

    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use('/icons', express.static(path.join(__dirname, '..', 'public', 'icons')))
  }

  private configureLogging() {
    const logFormat = this.env === 'production' ? 'combined' : 'dev'
    this.app.use(morgan(logFormat, { stream }))
  }

  private configureCors() {
    const corsOptions = {
      origin: this.env === 'production' ? 'https://your.domain.com' : true,
      credentials: true,
    }
    this.app.use(cors(corsOptions))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router)
    })
  }

  private initializeSwagger() {
    const specs = swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example documentation',
        },
      },
      apis: ['swagger.yaml'],
    })

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeWebSocket() {
    this.io.on('connection', socket => {
      logger.info('[WebSocket] New client connected')
      this.softwareVersionChecker.connectSocket(socket)
    })
  }

  private initializeExternalServices() {
    this.initBaramundi()
    this.initWinget()
    this.initWebex()
  }

  private initBaramundi() {
    const { BARAMUNDI_URL, BARAMUNDI_USERNAME, BARAMUNDI_SECRET } = process.env

    this.baramundi = new BaramundiApi({
      baseUrl: BARAMUNDI_URL,
      username: BARAMUNDI_USERNAME,
      password: BARAMUNDI_SECRET,
    })

    this.softwareVersionChecker.connectBaramundiApi(this.baramundi)
  }

  private initWinget() {
    const { GITHUB_TOKEN, GITHUB_URL } = process.env

    const wingetApi = new WingetGitHubApi({
      baseUrl: GITHUB_URL,
      token: GITHUB_TOKEN,
    })

    this.softwareVersionChecker.connectWingetApi(wingetApi)
  }

  private initWebex() {
    const { WEBEX_BOT_TOKEN, WEBEX_URL } = process.env

    if (!WEBEX_BOT_TOKEN) return

    this.webexBot = new WebexBot({
      baseUrl: WEBEX_URL,
      token: WEBEX_BOT_TOKEN,
    })

    const notifier = new SoftwareUpdateNotifier(this.webexBot)
    this.softwareVersionChecker.connectNotifier(notifier)
  }

  private handleShutdown() {
    const gracefulShutdown = async () => {
      logger.info('🛑 Gracefully shutting down the server...')
      await this.webexBot?.stop()
      process.exit(0)
    }

    process.on('SIGINT', gracefulShutdown)
    process.on('SIGTERM', gracefulShutdown)
  }
}

export default App
