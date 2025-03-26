import 'dotenv/config'
import { initRoles } from '@models/role.model'

process.env['NODE_CONFIG_DIR'] = `${__dirname}/config`

import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { createServer, Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import DB from '@databases'
import Routes from '@/interfaces/route.interface'
import errorMiddleware from '@middlewares/error.middleware'
import { logger, stream } from '@utils/logger'
import { BaramundiApi } from './classes/BaramundiApi'
import WebexBot from './classes/WebexNodeBotFramework'

class App {
  public app: express.Application
  public port: string | number
  public env: string
  public httpServer: HttpServer
  public io: Server
  public baramundi: BaramundiApi
  public webexBot?: WebexBot // Optional

  // Baramundi Credentials
  private baraUrl: string
  private baraUsername: string
  private baraSecret: string

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.env = process.env.NODE_ENV || 'development'
    this.httpServer = createServer(this.app)
    this.io = new Server(this.httpServer, { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } })

    // Load Baramundi credentials from env variables
    this.baraUrl = process.env.BARAMUNDI_URL
    this.baraUsername = process.env.BARAMUNDI_USERNAME
    this.baraSecret = process.env.BARAMUNDI_SECRET

    // Initialize app components
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    this.initializeErrorHandling()

    // Baramundi API initialization
    this.baramundi = new BaramundiApi(this.baraUrl, this.baraUsername, this.baraSecret)

    // Webex Bot Initialization (Only if token is provided)
    if (process.env.WEBEX_BOT_TOKEN) {
      this.webexBot = new WebexBot(process.env.WEBEX_BOT_TOKEN)
    }

    this.handleShutdown()
  }

  public async listen() {
    await this.connectToDatabase()
    this.httpServer.listen(this.port, () => {
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on port ${this.port}`)
    })
  }

  public getServer() {
    return this.httpServer
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
  }

  private configureLogging() {
    const logMode = this.env === 'production' ? 'combined' : 'dev'
    this.app.use(morgan(logMode, { stream }))
  }

  private configureCors() {
    const corsOptions = {
      origin: this.env === 'production' ? 'your.domain.com' : true,
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
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    }

    const specs = swaggerJSDoc(options)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private handleShutdown() {
    process.on('SIGINT', () => {
      logger.info('🛑 Gracefully shutting down the server...')
      this.webexBot?.stop()
      process.exit(0)
    })
  }
}

export default App
