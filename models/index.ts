import { Sequelize } from 'sequelize';
import userModel, { User } from './userModel';
import tradeModel, { Trade } from './tradeModel';

// Initialize models and their associations
export const initializeModels = (sequelize: Sequelize) => {
    const UserModel = userModel(sequelize);
    const TradeModel = tradeModel(sequelize);

    UserModel.hasMany(TradeModel, {
        foreignKey: 'ownerId',
        as: 'trades'
    });

    TradeModel.belongsTo(UserModel, {
        foreignKey: 'ownerId',
        as: 'owner'
    });

    return {
        User: UserModel,
        Trade: TradeModel,
        sequelize
    };
};

export { User, Trade };