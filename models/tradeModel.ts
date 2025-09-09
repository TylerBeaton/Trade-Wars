import { DataTypes, Model, Sequelize } from 'sequelize';
import { TradeAttributes } from '../interfaces/tradeAttributes';

export class Trade extends Model<TradeAttributes> implements TradeAttributes {
    public id?: number;
    public ownerId!: number;
    public gameId!: number;
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
        gameId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.STRING(4),
            allowNull: false,
            validate: {
                isUppercase: true,
                len: [1, 4]
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0.01
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
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