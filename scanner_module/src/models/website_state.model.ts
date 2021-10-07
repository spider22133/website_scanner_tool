import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { WebsiteState } from '@/interfaces/website_state.interface';

export type WebsiteStateCreationAttributes = Optional<WebsiteState, 'id'>;

export class WebsiteStateModel extends Model<WebsiteState, WebsiteStateCreationAttributes> implements WebsiteState {
  public id: number;
  public website_id: number;
  public answer_code: number;
  public answer_time: number;

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
      website_id: {
        type: DataTypes.INTEGER,
      },
      answer_code: {
        type: DataTypes.INTEGER,
      },
      answer_time: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'website_states',
      sequelize,
    },
  );

  return WebsiteStateModel;
}
