import { Sequelize } from 'sequelize';
import userModel, { User } from './userModel';
import tradeModel, { Trade } from './tradeModel';
import gameModel, { Game } from './gameModel';
import playerModel, { Player } from './playerModel';

// Initialize models and their associations
export const initializeModels = (sequelize: Sequelize) => {
    const UserModel = userModel(sequelize);
    const TradeModel = tradeModel(sequelize);
    const GameModel = gameModel(sequelize);
    const PlayerModel = playerModel(sequelize);

    TradeModel.belongsTo(PlayerModel, {
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

    UserModel.hasMany(GameModel, {
        foreignKey: 'ownerId',
        as: 'ownedGames'
    })

    GameModel.belongsToMany(UserModel, {
        through: PlayerModel,
        as: 'users',
        foreignKey: 'gameId',
        otherKey: 'userId'
    })

    // Player associations

    PlayerModel.belongsTo(GameModel, {
        foreignKey: 'gameId',
        as: 'game'
    })

    PlayerModel.belongsTo(UserModel, {
        foreignKey: 'userId',
        as: 'user'
    })

    PlayerModel.hasMany(TradeModel, {
        foreignKey: 'ownerId',
        as: 'trades'
    })

    GameModel.hasMany(PlayerModel, {
        foreignKey: 'gameId',
        as: 'players'
    })

    UserModel.hasMany(PlayerModel, {
        foreignKey: 'userId',
        as: 'playerRoles'
    })
    

    return {
        User: UserModel,
        Player: PlayerModel,
        Trade: TradeModel,
        Game: GameModel,
        sequelize
    };
};

export { User, Trade, Game, Player };