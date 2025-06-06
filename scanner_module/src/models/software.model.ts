import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  HasManyGetAssociationsMixin,
  Association,
  HasManyCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  NonAttribute,
} from 'sequelize'
import { Software } from '@/interfaces/software.interface'
import { SoftwareVersionModel } from './software_version.model'
import { UserModel } from './user.model'
import { SoftwareUser } from './software_user.model'
import { IssueModel } from './issue.model'

export type SoftwareCreationAttributes = Optional<Software, 'id' | 'name' | 'source' | 'icon'>

export class SoftwareModel extends Model<Software, SoftwareCreationAttributes> {
  public id: number
  public name: string
  public winget_id: string
  public version: string
  public bara_version: string
  public icon: string
  public source: string
  public details: string
  public subscribeCreateIssue: boolean
  public is_central_managed: boolean
  public is_hidden: boolean
  public is_current: boolean

  // inclusions
  public versions?: NonAttribute<SoftwareVersionModel[]>
  public issues?: NonAttribute<IssueModel[]>
  public users?: NonAttribute<SoftwareUser[]>

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getIssues!: HasManyGetAssociationsMixin<IssueModel>

  public getVersions!: HasManyGetAssociationsMixin<SoftwareVersionModel>
  public createVersion!: HasManyCreateAssociationMixin<SoftwareVersionModel>

  public getUsers!: BelongsToManyGetAssociationsMixin<UserModel>
  public setUsers!: BelongsToManySetAssociationsMixin<SoftwareUser, number>

  public async getLastVersion(): Promise<SoftwareVersionModel | null> {
    const versions = await this.getVersions({
      order: [['updatedAt', 'DESC']],
      limit: 1,
    })

    return versions.length > 0 ? versions[0] : null
  }

  public async getLastIssue(): Promise<IssueModel | null> {
    const issues = await this.getIssues({
      order: [['createdAt', 'DESC']],
      limit: 1,
    })

    return issues.length > 0 ? issues[0] : null
  }

  public async getPrimaryResponsible(): Promise<UserModel | null> {
    const [primaryResponsible] = await this.getUsers({
      include: [
        {
          model: SoftwareUser,
          as: 'userSettings',
          where: {
            isPrimaryResponsible: true,
          },
        },
      ],
      limit: 1,
    })
    return primaryResponsible || null
  }

  public static associations: {
    versions: Association<SoftwareModel, SoftwareVersionModel>
    users: Association<SoftwareModel, SoftwareUser>
    issues: Association<SoftwareModel, IssueModel>
  }
}

export default function (sequelize: Sequelize): typeof SoftwareModel {
  SoftwareModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      winget_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      version: {
        type: DataTypes.STRING,
      },
      bara_version: {
        type: DataTypes.STRING,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subscribeCreateIssue: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_central_managed: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      is_hidden: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      is_current: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'software',
      sequelize,
    },
  )

  return SoftwareModel
}
