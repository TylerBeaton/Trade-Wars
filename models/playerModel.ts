import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import { PlayerAttributes } from '../interfaces/playerAttributes';
import { User } from './userModel';

export class Player extends Model<PlayerAttributes> {
  declare id: number;
  declare gameId: number;
  declare userId: number;
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
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
