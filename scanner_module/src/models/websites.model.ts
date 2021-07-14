import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Website } from '@interfaces/websites.interface';
import { WebsiteStateModel } from '@models/website_status.model';

export type WebsiteCreationAttributes = Optional<Website, 'id'>;

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

  WebsiteModel.hasMany(WebsiteStateModel, {
    sourceKey: 'id',
    foreignKey: 'website_id',
    as: 'website_state',
  });

  WebsiteStateModel.belongsTo(WebsiteModel, {
    foreignKey: 'website_id',
    as: 'website',
  });

  return WebsiteModel;
}
