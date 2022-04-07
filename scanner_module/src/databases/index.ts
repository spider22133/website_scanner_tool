import config from 'config';
import { Sequelize } from 'sequelize';
import { dbConfig } from '@interfaces/db.interface';
import UserModel from '@/models/user.model';
import RoleModel from '@models/role.model';
import WebsiteModel from '@/models/website.model';
import WebsiteStateModel from '@/models/website_state.model';
import WebsiteControlStepModel from '@models/website_control_step.model';

const { host, user, password, database, pool, port }: dbConfig = config.get('dbConfig');
const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  timezone: '+01:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: pool.min,
    max: pool.max,
  },
  logQueryParameters: process.env.NODE_ENV === 'development',
  logging: (query, time) => {
    // logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize.authenticate();

const DB = {
  Roles: RoleModel(sequelize),
  WebsiteStates: WebsiteStateModel(sequelize),
  WebsiteControlSteps: WebsiteControlStepModel(sequelize),
  Websites: WebsiteModel(sequelize),
  Users: UserModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
