import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  Association,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyCountAssociationsMixin,
  BelongsToManySetAssociationsMixin,
} from 'sequelize'
import { User } from '@/interfaces/user.interface'
import { RoleModel } from './role.model'
import { SoftwareModel } from './software.model'

export type UserCreationAttributes = Optional<User, 'id'>

export class UserModel extends Model<User, UserCreationAttributes> {
  public id: number
  public firstName: string
  public lastName: string
  public email: string
  public roles?: RoleModel[]

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getRoles!: BelongsToManyGetAssociationsMixin<RoleModel>
  public hasRole!: BelongsToManyHasAssociationMixin<RoleModel, number>
  public setRoles!: BelongsToManySetAssociationsMixin<RoleModel, number>
  public countRoles!: BelongsToManyCountAssociationsMixin

  public getSoftware!: HasManyGetAssociationsMixin<SoftwareModel>
  public setSoftware!: HasManySetAssociationsMixin<SoftwareModel, number>
  public removeSoftware!: HasManyRemoveAssociationMixin<SoftwareModel, number>
  public countSoftware!: HasManyCountAssociationsMixin

  public static associations: {
    roles: Association<UserModel, RoleModel>
  }
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  )

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

  return UserModel
}
