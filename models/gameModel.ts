import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { GameAttributes } from '../interfaces/gameAttributes';
import { Player } from './playerModel';
export class Game extends Model<GameAttributes> {
  declare id: number;
  declare name: string;
  declare description: string;
  declare maxPlayers: number;

  declare ownerId: string;
  declare startingBalance: number;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare isActive: boolean;
  declare endsAt: Date;
  declare players: Player[];
  declare winner: number;

  addPlayer!: (player: Player) => Promise<void>;
  removePlayer!: (playerId: number) => Promise<void>;

  // Add other associations like remove, set, get, has...etc

  // addPlayers
  // removePlayer
  // removePlayers

  // setPlayer
  // setPlayers

  // hasPlayer
  // hasPlayers

  // countPlayers?

  static associations: {
    players: Association<Game, Player>;
  };
}

export default (sequelize: Sequelize) => {
  Game.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      maxPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 100,
        },
      },
      ownerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      startingBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get(this: any) {
          const raw = this.getDataValue('startingBalance');
          return raw === null ? null : parseFloat(String(raw));
        },
        defaultValue: 10000.0,
        validate: {
          min: 0,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      endsAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'games',
    }
  );

  return Game;
};
