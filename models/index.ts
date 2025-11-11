// models/index.ts
import { Sequelize } from 'sequelize';
import sequelize from './sequelize';
import userModel from './userModel';
import tradeModel from './tradeModel';
import gameModel from './gameModel';
import playerModel from './playerModel';

// Initialize models immediately
const UserModel = userModel(sequelize);
const TradeModel = tradeModel(sequelize);
const GameModel = gameModel(sequelize);
const PlayerModel = playerModel(sequelize);

// Set up associations
TradeModel.belongsTo(PlayerModel, {
  foreignKey: 'ownerId',
  as: 'owner',
});

TradeModel.belongsTo(GameModel, {
  foreignKey: 'gameId',
  as: 'game',
});

GameModel.hasMany(TradeModel, {
  foreignKey: 'gameId',
  as: 'trades',
});

// Owner of the game
GameModel.belongsTo(UserModel, {
  foreignKey: 'ownerId',
  as: 'owner',
});

UserModel.hasMany(GameModel, {
  foreignKey: 'ownerId',
  as: 'ownedGames',
});

GameModel.belongsToMany(UserModel, {
  through: PlayerModel,
  as: 'users',
  foreignKey: 'gameId',
  otherKey: 'userId',
});

// Player associations
PlayerModel.belongsTo(GameModel, {
  foreignKey: 'gameId',
  as: 'game',
});

PlayerModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

PlayerModel.hasMany(TradeModel, {
  foreignKey: 'ownerId',
  as: 'trades',
});

GameModel.hasMany(PlayerModel, {
  foreignKey: 'gameId',
  as: 'players',
});

UserModel.hasMany(PlayerModel, {
  foreignKey: 'userId',
  as: 'playerRoles',
});

// Export the initialized models (these are actual Sequelize model instances)
export const User = UserModel;
export const Trade = TradeModel;
export const Game = GameModel;
export const Player = PlayerModel;

export type { GameAttributes } from '../interfaces/gameAttributes';
export type { PlayerAttributes } from '../interfaces/playerAttributes';
export type { TradeAttributes } from '../interfaces/tradeAttributes';
export type { UserAttributes } from '../interfaces/userAttributes';

export { sequelize };

// Keep the function for backwards compatibility if needed
export const initializeModels = (sequelize: Sequelize) => {
  return {
    User: UserModel,
    Player: PlayerModel,
    Trade: TradeModel,
    Game: GameModel,
    sequelize,
  };
};
