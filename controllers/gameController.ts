import { Request, Response } from 'express';
import { Game } from '../models/gameModel';
import { User } from '../models/userModel';
import { Trade } from '../models/tradeModel';

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

                await gameInstance.addPlayer(userId);
                res.json({ message: `User ${userId} added to game ${gameId}` });

            }
            catch (err) {
                //console.error('Error adding player to game:', err);
                res.status(500).json({ error: 'Failed to add player to the game' });
            }
        },

        removePlayerFromGame: async (req: Request, res: Response) => {
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

                await gameInstance.removePlayer(userId);
                res.json({ message: `User ${userId} removed from game ${gameId}` });
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
                const gameInstance = await game.findByPk(gameId, {
                    include: [{
                        association: 'players',
                        attributes: ['id', 'firstName', 'lastName']
                    }]
                });

                if (!gameInstance) {
                    return res.status(404).json({ error: `Game with ID ${gameId} not found` });
                }
                return res.json(gameInstance.players);

            }
            catch (err) {
                //console.error('Error fetching players by game ID:', err);
                res.status(500).json({ error: 'Failed to fetch players for the game' });
            }
        },

        getTradesByGameId: async (req: Request, res: Response) => {

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

