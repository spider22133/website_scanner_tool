import { Sequelize, DataTypes, Model, Optional, BelongsToSetAssociationMixin } from 'sequelize'
import { SoftwareVersion } from '@interfaces/software_version.interface'
import { SoftwareModel } from '@models/software.model'

export type SoftwareVersionCreationAttributes = Optional<SoftwareVersion, 'id'>

export class SoftwareVersionModel extends Model<SoftwareVersion, SoftwareVersionCreationAttributes> implements SoftwareVersion {
  public id: number
  public software_id: number
  public version: string

  public setSoftware!: BelongsToSetAssociationMixin<SoftwareModel, number>

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize): typeof SoftwareVersionModel {
  SoftwareVersionModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      software_id: {
        type: DataTypes.INTEGER,
      },
      version: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'software_versions',
      sequelize,
    },
  )

  return SoftwareVersionModel
}
