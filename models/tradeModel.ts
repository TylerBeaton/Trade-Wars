import { DataTypes, Model, Sequelize } from 'sequelize';
import { TradeAttributes } from '../interfaces/tradeAttributes';

export class Trade extends Model<TradeAttributes> {
  declare id: number;
  declare ownerId: number;
  declare gameId: number;
  declare stock: string;
  declare price: number;
  declare quantity: number;
  declare type: 'buy' | 'sell';
  declare description: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  Trade.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
          isUppercase: true,
          len: [1, 6],
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
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
      },
    },
    {
      sequelize,
      tableName: 'trades',
    }
  );

  return Trade;
};
