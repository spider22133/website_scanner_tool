import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { WebsiteState } from '@/interfaces/website_state.interface';

export type WebsiteStateCreationAttributes = Optional<WebsiteState, 'id'>;

export class WebsiteStateModel extends Model<WebsiteState, WebsiteStateCreationAttributes> implements WebsiteState {
  public id: number;
  public step_id: number;
  public response_code: number;
  public response_time: number;
  public response_text: string;
  public is_error: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof WebsiteStateModel {
  WebsiteStateModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      step_id: {
        type: DataTypes.INTEGER,
      },
      response_code: {
        type: DataTypes.INTEGER,
      },
      response_time: {
        type: DataTypes.INTEGER,
      },
      response_text: {
        type: DataTypes.TEXT,
      },
      is_error: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'website_control_step_states',
      sequelize,
    },
  );

  return WebsiteStateModel;
}
