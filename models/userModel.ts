import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import { UserAttributes } from '../interfaces/userAttributes';

export class User extends Model<UserAttributes> {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
    }
  );
  return User;
};
