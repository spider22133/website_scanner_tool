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
  NonAttribute,
} from 'sequelize'
import { User } from '@/interfaces/user.interface'
import { RoleModel } from './role.model'
import { SoftwareModel } from './software.model'
import { SoftwareUser } from './software_user.model'

export type UserCreationAttributes = Optional<User, 'id'>

export class UserModel extends Model<User, UserCreationAttributes> {
  public id: number
  public firstName: string
  public lastName: string
  public userName: string
  public email: string

  // public subscribeIssueCreate!: boolean
  // public isPrimaryResponsible!: boolean
  // public isRepresentative!: boolean

  // inclusions
  public roles?: NonAttribute<RoleModel[]>

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
      userName: {
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

  return UserModel
}
