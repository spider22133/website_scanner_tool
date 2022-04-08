import { Sequelize, DataTypes, Model, Optional, HasManyGetAssociationsMixin, Association, HasManyCreateAssociationMixin } from 'sequelize';
import { Website } from '@/interfaces/website.interface';
import { WebsiteControlStepModel } from './website_control_step.model';

export type WebsiteCreationAttributes = Optional<Website, 'id' | 'name' | 'url'>;

export class WebsiteModel extends Model<Website, WebsiteCreationAttributes> {
  public id: number;
  public name: string;
  public url: string;
  public is_hidden: boolean;
  public is_active: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSteps!: HasManyGetAssociationsMixin<WebsiteControlStepModel>;
  public createStep!: HasManyCreateAssociationMixin<WebsiteControlStepModel>;

  public static associations: {
    projects: Association<WebsiteModel, WebsiteControlStepModel>;
  };
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

  WebsiteModel.hasMany(WebsiteControlStepModel, {
    sourceKey: 'id',
    foreignKey: 'website_id',
    as: 'steps',
    onDelete: 'CASCADE',
  });

  WebsiteControlStepModel.belongsTo(WebsiteModel, {
    foreignKey: 'website_id',
    as: 'websites',
  });

  return WebsiteModel;
}
