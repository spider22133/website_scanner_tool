import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Website } from '@interfaces/websites.interface';

export type WebsiteCreationAttributes = Optional<Website, 'id' | 'name' | 'url' | 'is_active'>;

export class WebsiteModel extends Model<Website, WebsiteCreationAttributes> implements Website {
  public id: number;
  public name: string;
  public url: string;
  public is_active: boolean;

  public readonly createdAt!: Date;
}

export default function (sequelize: Sequelize): typeof WebsiteModel {
  WebsiteModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      url: {
        type: DataTypes.STRING(255),
      },
      is_active: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'websites',
      sequelize,
    },
  );

  return WebsiteModel;
}
