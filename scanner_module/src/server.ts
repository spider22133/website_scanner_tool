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
import SoftwareVersionChecker from '@/softwareVersionChecker'

process.env['NODE_CONFIG_DIR'] = __dirname + '/config'

validateEnv()

const softwareVersionChecker = new SoftwareVersionChecker()
const timer = new TimerController(softwareVersionChecker)

timer.interval = 3600000
timer.run()

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new SoftwareRoute(softwareVersionChecker),
  new TimerRoute(timer),
  new WebsiteStepsRoute(),
])

app.io.on('connection', socket => {
  console.log('New client connected')
  softwareVersionChecker.connectSocket(socket)
})

app.listen()
