import { Request, Response } from 'express';
import { Game } from '../models/gameModel';
import { User } from '../models/userModel';
import { Trade } from '../models/tradeModel';
import { Player } from '../models/playerModel';

export default (game: typeof Game) => {
    return {

        // POST Trade Operations //

        TransactTradeForGame: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;

                const gameInstance = await game.findByPk(gameId);
                if (!gameInstance) {
                    return res.status(404).json({ error: `Game with ID ${gameId} not found` });
                }

                // Validation
                if (!req.body.ownerId) return res.status(400).json({ error: 'ownerId is required' });
                const tradeData = {
                    ...req.body,
                    gameId: gameId,
                }

                const instance = await Trade.create({
                    ownerId: tradeData.ownerId,
                    gameId: tradeData.gameId,
                    stock: tradeData.stock,
                    price: tradeData.price,
                    quantity: tradeData.quantity,
                    type: tradeData.type,
                    description: tradeData.description,
                    isActive: true,
                });

                res.status(201).json(instance);
            }
            catch (err: any) {
                //console.error("Error creating trade for game:", err)
                res.status(400).json({ error: err.message });
            }

        },

        // POST Player Operations //

        addPlayerToGame: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;
                const { userId } = req.body;

                if (!userId) {
                    return res.status(400).json({ error: 'userId is required' });
                }

                const gameInstance = await game.findByPk(gameId);
                if (!gameInstance) {
                    return res.status(404).json({ error: `Game with ID ${gameId} not found` });
                }

                const player = await Player.create({
                    gameId: parseInt(gameId),
                    userId: userId,
                    balance: gameInstance.startingBalance,
                })

                // await gameInstance.addPlayer(userId);
                res.status(201).json({
                    message: `User ${player.id} added to game ${gameId}`,
                    player: player
                });

            }
            catch (err) {
                console.error('Error adding player to game:', err);
                res.status(500).json({ error: 'Failed to add player to the game' });
            }
        },

        removePlayerFromGame: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;
                const { playerId } = req.body;

                if (!playerId) {
                    return res.status(400).json({ error: 'playerId is required' });
                }

                const gameInstance = await game.findByPk(gameId);
                if (!gameInstance) {
                    return res.status(404).json({ error: `Game with ID ${gameId} not found` });
                }

                await gameInstance.removePlayer(playerId);
                res.json({ message: `Player ${playerId} removed from game ${gameId}` });
            }
            catch (err) {
                //console.error('Error removing player from game:', err);
                res.status(500).json({ error: 'Failed to remove player from the game' });
            }
        },

        // Get by Id

        getGameById: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;
                const gameInstance = await game.findByPk(gameId);
                res.json(gameInstance);
            }
            catch (err) {
                res.status(500).json({ error: 'Failed to fetch game' });
            }
        },

        getPlayersByGameId: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;
                const players = await Player.findAll({
                    where: { gameId: gameId },
                    attributes: ['id', 'userId', 'balance'],
                })

                if (!players) {
                    return res.status(404).json({ error: `No players found for game with ID ${gameId}` });
                }
                return res.json(players);

            }
            catch (err) {
                //console.error('Error fetching players by game ID:', err);
                res.status(500).json({ error: 'Failed to fetch players for the game' });
            }
        },

        getPlayerInGameById: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;
                const playerId = req.params.playerId;
                const gameInstance = await game.findByPk(gameId);
                if (!gameInstance) {
                    return res.status(404).json({ error: `Game with ID ${gameId} not found` });
                }

                const player = await Player.findOne({
                    where: {
                        id: playerId,
                        gameId: gameId
                    }
                })

                if (!player) {
                    return res.status(404).json({ error: `Player with ID ${playerId} not found in game ${gameId}` });
                }

                return res.json(player);
            }
            catch (err: any) {
                console.error('Error fetching player by ID:', err);
                res.status(500).json({ error: 'Failed to fetch player', details: err.message });
            }

        },

        getTradesByGameId: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;

                const trades = await Trade.findAll({
                    where: { gameId: gameId }
                });

                res.json(trades);
            }
            catch (err: any) {
                //console.error('Error fetching trades by game ID:', err);
                res.status(500).json({ error: 'Failed to fetch trades for the game' });
            }
        },

        // CRUD operations //

        // POST /games (Create)
        createGame: async (req: Request, res: Response) => {
            try {
                if (!req.body.name) return res.status(400).json({ error: 'name is required' });
                if (!req.body.maxPlayers) return res.status(400).json({ error: 'maxPlayers is required' });
                if (!req.body.ownerId) return res.status(400).json({ error: 'ownerId is required' });
                const instance = await game.create({
                    name: req.body.name,
                    description: req.body.description,
                    maxPlayers: req.body.maxPlayers,
                    ownerId: req.body.ownerId,
                    startingBalance: req.body.startingBalance ?? 10000.00,
                    isActive: req.body.isActive ?? true,
                });
                //console.log('Created game:', instance.toJSON());
                res.status(201).json(instance);
            } catch (err: any) {
                //console.error('Error creating game:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // GET /games (Read)
        getGames: async (req: Request, res: Response) => {
            try {
                const games = await game.findAll();
                res.json(games);
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch games' });
            }
        },

        // PUT /game/:id (Update)
        updateGame: async (req: Request, res: Response) => {
            try {
                // if (!req.body.name) return res.status(400).json({ error: 'name is required' });

                await game.update(
                    {
                        name: req.body.name,
                        description: req.body.description,
                        maxPlayers: req.body.maxPlayers,
                        isActive: req.body.isActive,
                    },
                    {
                        where: { id: req.params.id }
                    }
                );
                const updatedGame = await game.findByPk(req.params.id);
                res.json(updatedGame);
            } catch (err: any) {
                //console.error('Error updating game:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // DELETE /game/:id (Delete)
        deleteGame: async (req: Request, res: Response) => {
            try {
                const gameId = req.params.id;
                const deletedGame = await game.destroy({
                    where: { id: gameId }
                });

                if (deletedGame) {
                    res.json({ message: `Game ${gameId} deleted` });
                }
                else {
                    res.status(404).json({ error: `Game ${gameId} not found` });
                }
            } catch (err: any) {
                //console.error('Error deleting game:', err);
                res.status(500).json({ error: err.message });
            }
        }
    }
}

