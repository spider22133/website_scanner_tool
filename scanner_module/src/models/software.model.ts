import { Sequelize, DataTypes, Model, Optional, HasManyGetAssociationsMixin, Association, HasManyCreateAssociationMixin } from 'sequelize'
import { Software } from '@/interfaces/software.interface'
import { SoftwareVersionModel } from './software_version.model'
import { str } from 'envalid'

export type SoftwareCreationAttributes = Optional<Software, 'id' | 'name' | 'source'>

export class SoftwareModel extends Model<Software, SoftwareCreationAttributes> {
  public id: number
  public name: string
  public winget_id: string
  public version: string
  public bara_version: string
  public source: string
  public details: string
  public is_hidden: boolean
  public is_current: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getVersions!: HasManyGetAssociationsMixin<SoftwareVersionModel>
  public createVersion!: HasManyCreateAssociationMixin<SoftwareVersionModel>

  public static associations: {
    projects: Association<SoftwareModel, SoftwareVersionModel>
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
      version: {
        type: DataTypes.STRING,
      },
      bara_version: {
        type: DataTypes.STRING,
      },
      source: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.TEXT,
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

  return SoftwareModel
}
