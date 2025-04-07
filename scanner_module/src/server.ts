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
import { ActiveDirectoryAuth } from './classes/api/ActiveDirectoryAuth'

// 1️⃣ Environment Setup
process.env['NODE_CONFIG_DIR'] = `${__dirname}/config`
validateEnv()

// 2️⃣ Dependency Initialization
const softwareVersionChecker = new SoftwareVersionChecker()
const timerController = TimerController.getInstance(softwareVersionChecker)
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

// const ad = new ActiveDirectoryAuth({
//   url: 'ldap://sv-inf-dc1.med.tu-dresden.de',
//   baseDN: 'DC=med,DC=tu-dresden,DC=de',
//   bindDN: process.env.AD_SERVICE_USER_NAME,
//   bindPassword: process.env.AD_SERVICE_USER_PASSWORD,
// })

// ;(async () => {
//   const isAuthenticated = await ad.authenticate('Eugen.Schlosser@ukdd.de', 'Nokia#060')
//   console.log('Authenticated?', isAuthenticated)

//   const user = await ad.findUser('SCHLOSSEU@med.tu-dresden.de')
//   console.log('User info:', user)
// })()
