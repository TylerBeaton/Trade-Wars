import { Sequelize } from 'sequelize';
import userModel, { User } from './userModel';
import tradeModel, { Trade } from './tradeModel';
import gameModel, { Game } from './gameModel';

// Initialize models and their associations
export const initializeModels = (sequelize: Sequelize) => {
    const UserModel = userModel(sequelize);
    const TradeModel = tradeModel(sequelize);
    const GameModel = gameModel(sequelize);

    UserModel.hasMany(TradeModel, {
        foreignKey: 'ownerId',
        as: 'trades'
    });

    UserModel.hasMany(GameModel, {
        foreignKey: 'ownerId',
        as: 'games'
    });

    TradeModel.belongsTo(UserModel, {
        foreignKey: 'ownerId',
        as: 'owner'
    });

    TradeModel.belongsTo(GameModel, {
        foreignKey: 'gameId',
        as: 'game'
    });

    // Owner of the game
    GameModel.belongsTo(UserModel, {
        foreignKey: 'ownerId',
        as: 'owner'
    })

    GameModel.belongsToMany(UserModel, {
        through: 'gamePlayers',
        as: 'players',
        foreignKey: 'gameId'
    })

    UserModel.belongsToMany(GameModel, {
        through: 'gamePlayers',
        as: 'joinedGames',
        foreignKey: 'userId'
    });

    return {
        User: UserModel,
        Trade: TradeModel,
        Game: GameModel,
        sequelize
    };
};

export { User, Trade, Game };