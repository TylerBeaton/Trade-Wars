import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { GameAttributes } from '../interfaces/gameAttributes';
import { User } from './userModel';
export class Game extends Model<GameAttributes> implements GameAttributes {
    id?: number;
    name!: string;
    description?: string;
    maxPlayers!: number;

    ownerId!: number;

    createdAt!: Date;
    updatedAt?: Date;
    isActive!: boolean;
    players?: User[];

    // Add other associations like remove, set, get, has...etc
    addPlayer!: (user: User) => Promise<void>;

    static associations: {
        players: Association<Game, User>;
    };

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
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
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