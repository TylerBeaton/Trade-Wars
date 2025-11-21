import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import { PlayerAttributes } from '../interfaces/playerAttributes';
import { User } from './userModel';

export class Player extends Model<PlayerAttributes> {
  declare id: number;
  declare gameId: number;
  declare userId: string;
  declare balance: number;
  declare user: User;
}

export default (sequelize: Sequelize) => {
  Player.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get(this: any) {
          const raw = this.getDataValue('balance');
          return raw === null ? null : parseFloat(String(raw));
        },
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      tableName: 'players',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['gameId', 'userId'],
        },
      ],
    }
  );

  return Player;
};
