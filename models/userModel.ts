import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import { UserAttributes } from '../interfaces/userAttributes';

export class User extends Model<UserAttributes> {
  declare id: string;
  declare username?: string;
  declare name: string;
  declare email: string;
  declare emailVerified: boolean;
  declare image?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'user',
      modelName: 'User',
      timestamps: true,
    }
  );
  return User;
};
