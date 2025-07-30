import { DataTypes, Model, Sequelize } from 'sequelize';
import { TradeAttributes } from '../interfaces/tradeAttributes';
import { User } from './userModel'; // Assuming User model is defined in userModel.ts

export class Trade extends Model<TradeAttributes> implements TradeAttributes {
    public id!: number;
    public ownerId!: number;
    public stock!: string;
    public price!: number;
    public quantity!: number;
    public type!: 'buy' | 'sell';
    public description?: string;
    public isActive!: boolean;
    public createdAt!: Date;
    public updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
    Trade.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('buy', 'sell'),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        sequelize,
        tableName: 'trades',
    });

    return Trade;
}