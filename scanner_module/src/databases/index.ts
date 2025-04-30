import config from 'config'
import { Sequelize } from 'sequelize'
import { dbConfig } from '@interfaces/db.interface'

import { UserModel, default as initUserModel } from '@models/user.model'
import { RoleModel, default as initRoleModel } from '@models/role.model'
import { SoftwareModel, default as initSoftwareModel } from '@models/software.model'
import { SoftwareVersionModel, default as initSoftwareVersionModel } from '@models/software_version.model'
import { SoftwareRepresentative, default as initSoftwareRepresentativeModel } from '@models/software_representative.model'
import { IssueModel, default as initIssueModel } from '@models/issue.model'

const { host, user, password, database, pool, port }: dbConfig = config.get('dbConfig')
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
})

sequelize.authenticate()

const DB: any = {
  Roles: initRoleModel(sequelize),
  SoftwareVersions: initSoftwareVersionModel(sequelize),
  SoftwareRepresentative: initSoftwareRepresentativeModel(sequelize),
  Users: initUserModel(sequelize),
  Software: initSoftwareModel(sequelize),
  Issue: initIssueModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
}

function initAssociations() {
  // Issue belongs to exactly one user
  IssueModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  })

  // Issue belongs to exactly one software
  IssueModel.belongsTo(SoftwareModel, {
    foreignKey: 'software_id',
    as: 'software',
  })

  // Software Version
  SoftwareModel.hasMany(SoftwareVersionModel, {
    sourceKey: 'id',
    foreignKey: 'software_id',
    as: 'versions',
    onDelete: 'CASCADE',
  })

  SoftwareVersionModel.belongsTo(SoftwareModel, {
    foreignKey: 'software_id',
    as: 'software',
  })

  // Responsible for Software
  UserModel.hasMany(SoftwareModel, {
    foreignKey: 'user_id',
    as: 'software',
  })

  SoftwareModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  })

  // Representatives for Software
  SoftwareModel.belongsToMany(UserModel, {
    through: SoftwareRepresentative,
    foreignKey: 'software_id',
    otherKey: 'user_id',
    as: 'representatives',
  })

  UserModel.belongsToMany(SoftwareModel, {
    through: SoftwareRepresentative,
    foreignKey: 'user_id',
    otherKey: 'software_id',
    as: 'representedSoftware',
  })

  UserModel.belongsToMany(RoleModel, {
    as: 'roles',
    through: 'user_roles',
    foreignKey: 'user_id',
    otherKey: 'role_id',
  })

  RoleModel.belongsToMany(UserModel, {
    as: 'users',
    through: 'user_roles',
    foreignKey: 'role_id',
    otherKey: 'user_id',
  })
}

initAssociations()

export default DB
