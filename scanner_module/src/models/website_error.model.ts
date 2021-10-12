import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { WebsiteError } from '@/interfaces/website_error.interface';

export type WebsiteErrorCreationAttributes = Optional<WebsiteError, 'id'>;

export class WebsiteErrorModel extends Model<WebsiteError, WebsiteErrorCreationAttributes> implements WebsiteError {
  public id: number;
  public website_id: number;
  public answer_code: number;
  public answer_text: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof WebsiteErrorModel {
  WebsiteErrorModel.init(
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
      answer_text: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'website_errors',
      sequelize,
    },
  );

  return WebsiteErrorModel;
}
