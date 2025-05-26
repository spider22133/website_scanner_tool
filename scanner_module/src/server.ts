import 'dotenv/config'
import App from '@/app'
import AuthRoute from '@routes/auth.route'
import IndexRoute from '@routes/index.route'
import TimerRoute from '@routes/timer.route'
import UsersRoute from '@routes/users.route'
import WebsiteStepsRoute from '@routes/control_steps.route'
import SoftwareRoute from '@routes/software.route'
import validateEnv from '@utils/validateEnv'
import { logger } from './utils/logger'
import JiraRoute from './routes/jira.route'

// 1️⃣ Environment Setup
process.env['NODE_CONFIG_DIR'] = `${__dirname}/config`
validateEnv()

// 2️⃣ Initial App setup with independent routes
const app = new App([new JiraRoute(), new IndexRoute(), new UsersRoute(), new AuthRoute(), new WebsiteStepsRoute()])

// 3️⃣ Now that `app` is defined, inject dependent routes
app.addRoutes([new SoftwareRoute(app.softwareVersionChecker), new TimerRoute(app.timerController)])

// 4️⃣ Start App
app.listen()

// 5️⃣ Initialize bot
app.webexBot?.initialize().then(() => {
  logger.info('📢 Bot is ready to send messages.')
})
