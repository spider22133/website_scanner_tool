import 'dotenv/config'
import App from '@/app'
import AuthRoute from '@routes/auth.route'
import IndexRoute from '@routes/index.route'
import TimerRoute from '@routes/timer.route'
import UsersRoute from '@routes/users.route'
import WebsiteStepsRoute from '@routes/control_steps.route'
import SoftwareRoute from '@routes/software.route'
import validateEnv from '@utils/validateEnv'
import TimerController from '@controllers/timer.controller'
import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import { logger } from './utils/logger'
import SoftwareUpdateNotifier from './classes/SoftwareUpdateNotifier'

// 1️⃣ Environment Setup
process.env['NODE_CONFIG_DIR'] = `${__dirname}/config`
validateEnv()

// 2️⃣ Dependency Initialization
const softwareVersionChecker = new SoftwareVersionChecker()
const timerController = new TimerController(softwareVersionChecker)
timerController.interval = 8640000 // 6 Minutes
timerController.run()

// 3️⃣ Application Setup
const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new SoftwareRoute(softwareVersionChecker),
  new TimerRoute(timerController),
  new WebsiteStepsRoute(),
])

// 4️⃣ Start Application
app.listen()

// 5️⃣ Connect APIs after App is Running
softwareVersionChecker.connectBaramundiApi(app.baramundi)
softwareVersionChecker.connectNotifier(new SoftwareUpdateNotifier(app.webexBot))

// 6️⃣ WebSocket Handling (After Server Starts)
app.io.on('connection', socket => {
  logger.info('[WebSocket] New client connected')
  softwareVersionChecker.connectSocket(socket)
})

// Webex Bot initialization
app.webexBot.initialize().then(() => {
  logger.info('📢 Bot is ready to send messages.')
})
