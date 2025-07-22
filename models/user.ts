import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserAttributes } from '../interfaces/userAttributes';

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
}

export default (sequelize: Sequelize) => {
    User.init({
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
    },
    {
        sequelize,
        tableName: 'users',
    });
    return User;
}