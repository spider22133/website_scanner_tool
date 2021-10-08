process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import TimerRoute from '@routes/timer.route';
import UsersRoute from '@routes/users.route';
import StatesRoute from '@routes/states.route';
import WebsitesRoute from '@routes/websites.route';
import validateEnv from '@utils/validateEnv';
import TimerController from '@controllers/timer.controller';

validateEnv();

const timer = new TimerController();
timer.run();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new WebsitesRoute(), new TimerRoute(timer), new StatesRoute()]);

app.listen();
