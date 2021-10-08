import config from 'config';
import { Sequelize } from 'sequelize';
import { dbConfig } from '@interfaces/db.interface';
import UserModel from '@/models/user.model';
import RoleModel from '@models/role.model';
import WebsiteModel from '@/models/website.model';
import WebsiteStateModel from '@/models/website_state.model';
import { logger } from '@utils/logger';

const { host, user, password, database, pool }: dbConfig = config.get('dbConfig');
const sequelize = new Sequelize(database, user, password, {
  host: host,
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
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize.authenticate();

const DB = {
  WebsiteStates: WebsiteStateModel(sequelize),
  Websites: WebsiteModel(sequelize),
  Roles: RoleModel(sequelize),
  Users: UserModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
