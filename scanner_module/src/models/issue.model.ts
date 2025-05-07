import { Sequelize, DataTypes, Model, Optional, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Association } from 'sequelize'
import { UserModel } from './user.model'
import { SoftwareModel } from './software.model'
import { IssueAttributes } from '../../../types/common'

export type IssueCreationAttributes = Optional<IssueAttributes, 'id' | 'jira_id' | 'jira_key' | 'resolutionName' | 'resolutionDesc'>

export class IssueModel extends Model<IssueAttributes, IssueCreationAttributes> {
  public id!: number
  public priority!: string
  public user_id!: number
  public software_id!: number
  public software_version!: string
  public jira_id: string
  public jira_key: string
  public statusName: string
  public statusDesc: string
  public resolutionName?: string
  public resolutionDesc?: string

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
      statusName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statusDesc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resolutionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resolutionDesc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      software_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      software_version: {
        type: DataTypes.STRING,
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
