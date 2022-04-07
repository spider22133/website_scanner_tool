import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  Association,
} from 'sequelize';
import { User } from '@/interfaces/user.interface';
import { RoleModel } from './role.model';

export type UserCreationAttributes = Optional<User, 'id'>;

export class UserModel extends Model<User, UserCreationAttributes> {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getRoles!: BelongsToManyGetAssociationsMixin<RoleModel>; // Note the null assertions!
  public hasRole!: BelongsToManyHasAssociationMixin<RoleModel, number>;
  public countRoles!: BelongsToManyCountAssociationsMixin;

  public static associations: {
    roles: Association<UserModel, RoleModel>;
  };
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  UserModel.belongsToMany(RoleModel, {
    as: 'roles',
    through: 'user_roles',
    foreignKey: 'user_id',
    otherKey: 'role_id',
  });

  RoleModel.belongsToMany(UserModel, {
    as: 'users',
    through: 'user_roles',
    foreignKey: 'role_id',
    otherKey: 'user_id',
  });

  return UserModel;
}

// async function initUser() {
//   try {
//     await UserModel.create({
//       id: 1,
//       firstName: 'Eugen',
//       lastName: 'Schlosser',
//       email: 'e.schlosser.de@gmail.com',
//       password: '',
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
