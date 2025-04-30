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
import { SoftwareRepresentative } from './software_representative.model'

export type SoftwareCreationAttributes = Optional<Software, 'id' | 'name' | 'source' | 'icon'>

export class SoftwareModel extends Model<Software, SoftwareCreationAttributes> {
  public id: number
  public name: string
  public winget_id: string
  public user_id: number
  public version: string
  public bara_version: string
  public icon: string
  public source: string
  public details: string
  public is_central_managed: boolean
  public is_hidden: boolean
  public is_current: boolean

  // inclusions
  public user?: NonAttribute<UserModel>
  public versions?: NonAttribute<SoftwareVersionModel[]>

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getVersions!: HasManyGetAssociationsMixin<SoftwareVersionModel>
  public createVersion!: HasManyCreateAssociationMixin<SoftwareVersionModel>

  public getUser!: BelongsToGetAssociationMixin<UserModel>
  public setUser!: BelongsToSetAssociationMixin<UserModel, number>

  public getRepresentatives!: BelongsToManyGetAssociationsMixin<SoftwareRepresentative>
  public setRepresentatives!: BelongsToManySetAssociationsMixin<SoftwareRepresentative, number>

  public async getLastVersion(): Promise<SoftwareVersionModel | null> {
    const versions = await this.getVersions({
      order: [['updatedAt', 'DESC']],
      limit: 1,
    })

    // Return the first version if available, or null
    return versions.length > 0 ? versions[0] : null
  }

  public static associations: {
    versions: Association<SoftwareModel, SoftwareVersionModel>
    user: Association<SoftwareModel, UserModel>
    representatives: Association<SoftwareModel, SoftwareRepresentative>
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
      },
      user_id: {
        type: DataTypes.INTEGER,
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
