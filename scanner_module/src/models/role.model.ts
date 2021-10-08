import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Role } from '@interfaces/role.interface';

export type RoleCreationAttributes = Optional<Role, 'id' | 'name'>;

export class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
  public id: number;
  public name: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof RoleModel {
  RoleModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'roles',
      sequelize,
    },
  );

  RoleModel.create({
    id: 1,
    name: 'user',
  });

  RoleModel.create({
    id: 2,
    name: 'moderator',
  });

  RoleModel.create({
    id: 3,
    name: 'admin',
  });

  return RoleModel;
}
