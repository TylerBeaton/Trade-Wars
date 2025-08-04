import { DataTypes, Model, Sequelize } from 'sequelize';
import { GameAttributes } from '../interfaces/gameAttributes';

export class Game extends Model<GameAttributes> implements GameAttributes {
    id!: string;
    name!: string;
    description?: string;
    maxPlayers!: number;

    authorId!: number;

    players!: number[];
    trades!: number[];

    createdAt!: Date;
    updatedAt?: Date;
    isActive!: boolean;
}

export default (sequelize: Sequelize) => {
    Game.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 500]
            }
        },
        maxPlayers: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 100
            }
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        players: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            defaultValue: []
        },
        trades: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            defaultValue: []
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        sequelize,
        tableName: 'games',
    });

    return Game;
}