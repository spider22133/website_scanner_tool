import { Sequelize, DataTypes, Model, Optional, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Association } from 'sequelize'
import { UserModel } from './user.model'
import { SoftwareModel } from './software.model'

export interface IssueAttributes {
  id: number
  priority: string
  user_id: number
  software_id: number
  jira_id?: string
  jira_key?: string
  resolution?: string
}

export type IssueCreationAttributes = Optional<IssueAttributes, 'id' | 'jira_id' | 'jira_key' | 'resolution'>

export class IssueModel extends Model<IssueAttributes, IssueCreationAttributes> {
  public id!: number
  public priority!: string
  public user_id!: number
  public software_id!: number
  public jira_id?: string
  public jira_key?: string
  public resolution?: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getUser!: BelongsToGetAssociationMixin<UserModel>
  public setUser!: BelongsToSetAssociationMixin<UserModel, number>

  public getSoftware!: BelongsToGetAssociationMixin<SoftwareModel>
  public setSoftware!: BelongsToSetAssociationMixin<SoftwareModel, number>

  public static associations: {
    user: Association<IssueModel, UserModel>
    software: Association<IssueModel, SoftwareModel>
  }
}

export default function (sequelize: Sequelize): typeof IssueModel {
  IssueModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      jira_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jira_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '1',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      software_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'issues',
      sequelize,
    },
  )

  return IssueModel
}
