import { Sequelize, DataTypes, Model, Optional, HasManyRemoveAssociationsMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { Website } from '@/interfaces/website.interface';
import { WebsiteStateModel } from '@/models/website_state.model';

export type WebsiteCreationAttributes = Optional<Website, 'id' | 'is_active' | 'name' | 'url'>;

export class WebsiteModel extends Model<Website, WebsiteCreationAttributes> {
  public id: number;
  public name: string;
  public url: string;
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

  return WebsiteModel;
}
