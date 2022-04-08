import { Sequelize, DataTypes, Model, Optional, BelongsToSetAssociationMixin } from 'sequelize';
import { WebsiteControlStep } from '@/interfaces/website_control_step.interface';
import { WebsiteStateModel } from '@/models/website_state.model';
import { WebsiteModel } from '@models/website.model';

export type WebsiteControlStepCreationAttributes = Optional<WebsiteControlStep, 'id'>;

export class WebsiteControlStepModel extends Model<WebsiteControlStep, WebsiteControlStepCreationAttributes> implements WebsiteControlStep {
  public id: number;
  public website_id: number;
  public type: string;
  public description: string;
  public path: string;
  public api_call_data: string;
  public estimated_code: number;

  public setWebsite!: BelongsToSetAssociationMixin<WebsiteModel, number>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof WebsiteControlStepModel {
  WebsiteControlStepModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      website_id: {
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.TEXT,
      },
      description: {
        type: DataTypes.TEXT,
      },
      path: {
        type: DataTypes.TEXT,
      },
      api_call_data: {
        type: DataTypes.TEXT,
      },
      estimated_code: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'website_control_steps',
      sequelize,
    },
  );

  WebsiteControlStepModel.hasMany(WebsiteStateModel, {
    sourceKey: 'id',
    foreignKey: 'step_id',
    as: 'website_control_step_state',
    onDelete: 'CASCADE',
  });

  WebsiteStateModel.belongsTo(WebsiteControlStepModel, {
    foreignKey: 'step_id',
    as: 'website_control_step',
  });

  return WebsiteControlStepModel;
}
