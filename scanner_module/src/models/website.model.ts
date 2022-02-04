import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Website } from '@/interfaces/website.interface';
import { WebsiteStateModel } from '@/models/website_state.model';
import { WebsiteErrorModel } from './website_error.model';

export type WebsiteCreationAttributes = Optional<Website, 'id' | 'is_active' | 'name' | 'url'>;

export class WebsiteModel extends Model<Website, WebsiteCreationAttributes> {
  public id: number;
  public name: string;
  public url: string;
  public is_hidden: boolean;
  public is_active: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      is_hidden: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
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
    onDelete: 'CASCADE',
  });

  WebsiteStateModel.belongsTo(WebsiteModel, {
    foreignKey: 'website_id',
    as: 'website',
  });

  WebsiteModel.hasMany(WebsiteErrorModel, {
    sourceKey: 'id',
    foreignKey: 'website_id',
    as: 'website_error',
    onDelete: 'CASCADE',
  });

  WebsiteErrorModel.belongsTo(WebsiteModel, {
    foreignKey: 'website_id',
    as: 'website',
  });

  return WebsiteModel;
}
