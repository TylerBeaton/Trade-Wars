import { DataTypes, Model, Sequelize } from 'sequelize';
import { PlayerAttributes } from '../interfaces/playerAttributes';

export class Player
  extends Model<PlayerAttributes>
  implements PlayerAttributes
{
  public id?: number;
  public gameId!: number;
  public userId!: number;
  public balance!: number;
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
        allowNull: false,
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
