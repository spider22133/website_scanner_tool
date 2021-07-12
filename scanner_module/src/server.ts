process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import WebsiteChecker from 'websiteChecker';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import WebsitesRoute from '@routes/websites.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const websiteChecker = new WebsiteChecker();
websiteChecker.checkWebsites();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new WebsitesRoute()]);

app.listen();
