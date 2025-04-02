import { Sequelize, DataTypes, Model, Optional } from 'sequelize'

export interface SoftwareRepresentativeAttributes {
  user_id: number
  software_id: number
}

export class SoftwareRepresentative extends Model<SoftwareRepresentativeAttributes> implements SoftwareRepresentativeAttributes {
  public user_id!: number
  public software_id!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize): typeof SoftwareRepresentative {
  SoftwareRepresentative.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      software_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'SoftwareRepresentative',
      tableName: 'software_representative',
      timestamps: true, // Enable createdAt and updatedAt
    },
  )

  return SoftwareRepresentative
}
