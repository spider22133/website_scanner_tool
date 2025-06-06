import { Sequelize, DataTypes, Model } from 'sequelize'

export interface SoftwareUserAttributes {
  userId: number
  softwareId: number
  isPrimaryResponsible: boolean
  isRepresentative: boolean
}

export class SoftwareUser extends Model<SoftwareUserAttributes> implements SoftwareUserAttributes {
  public userId!: number
  public softwareId!: number
  public isPrimaryResponsible!: boolean
  public isRepresentative!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize): typeof SoftwareUser {
  SoftwareUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      softwareId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      isPrimaryResponsible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isRepresentative: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'userSettings',
      tableName: 'software_user',
      timestamps: true, // Enable createdAt and updatedAt
    },
  )

  return SoftwareUser
}
