import { Request, Response } from 'express';
import { Game } from '../models/gameModel';
import { User } from '../models/userModel';
import { Trade } from '../models/tradeModel';
import { Player } from '../models/playerModel';

export default (game: typeof Game) => {
  return {
    // POST Trade Operations //

    transactTradeForGame: async (req: Request, res: Response) => {
      // TODO: Add sequelize transaction support

      try {
        const gameId = req.params.id;

        const gameInstance = await game.findByPk(gameId);

        if (!gameInstance) {
          return res
            .status(404)
            .json({ error: `Game with ID ${gameId} not found` });
        }

        const player = await Player.findOne({
          where: { gameId: gameId, userId: req.body.ownerId },
        });

        if (!player) {
          return res.status(404).json({
            error: `Player with userId ${req.body.ownerId} not found in game ${gameId}`,
          });
        }

        if (!player.id) {
          return res.status(500).json({
            error: 'Player ID is missing',
          });
        }

        if (!req.body.ownerId)
          return res.status(400).json({ error: 'ownerId is required' });

        const tradeData = {
          ...req.body,
          gameId: gameId,
        };

        const tradeCost = tradeData.price * tradeData.quantity;

        if (tradeData.type === 'buy') {
          if (player.balance < tradeCost) {
            return res.status(400).json({
              error: `Insufficient balance. Player balance: ${player.balance}, Trade cost: ${tradeCost}`,
            });
          }
          // Deduct balance
          player.balance -= tradeCost;
        } else if (tradeData.type === 'sell') {
          // TODO: Get all player trades for this stock (active) and ensure they have enough to sell
          player.balance += tradeCost;
        } else {
          return res
            .status(400)
            .json({ error: `Invalid trade type: ${tradeData.type}` });
        }

        // TODO: Add trades to game instance to keep record
        const tradeInstance = await Trade.create({
          ownerId: player.id,
          gameId: tradeData.gameId,
          stock: tradeData.stock,
          price: tradeData.price,
          quantity: tradeData.quantity,
          type: tradeData.type,
          description: tradeData.description,
          isActive: true,
        });

        try {
          await player.save();
        } catch (err: any) {
          throw new Error(`Failed to update player balance: ${err.message}`);
        }
        res.status(201).json(tradeInstance);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    },

    // POST Player Operations //

    addPlayerToGame: async (req: Request, res: Response) => {
      const transaction = await Player.sequelize!.transaction();

      try {
        const gameId = req.params.id;
        const { userId } = req.body;

        if (!userId) {
          await transaction.rollback();
          return res.status(400).json({ error: 'userId is required' });
        }

        const gameInstance = await game.findByPk(gameId);
        if (!gameInstance) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ error: `Game with ID ${gameId} not found` });
        }

        const currentPlayerCount = await Player.count({
          where: { gameId: gameId },
          transaction,
        });

        if (currentPlayerCount >= gameInstance.maxPlayers) {
          await transaction.rollback();
          return res.status(400).json({
            error: 'Game is full',
          });
        }

        const existingPlayer = await Player.findOne({
          where: {
            gameId: gameId,
            userId: userId,
          },
          transaction,
        });

        if (existingPlayer) {
          await transaction.rollback();
          return res.status(400).json({
            error: `User ${userId} is already a player in game ${gameId}`,
          });
        }

        const player = await Player.create(
          {
            gameId: parseInt(gameId),
            userId: userId,
            balance: gameInstance.startingBalance,
          },
          { transaction }
        );

        await transaction.commit();

        const playerPlain = player.get({ plain: true }) as any;
        if (typeof playerPlain.balance === 'string') {
          playerPlain.balance = parseFloat(playerPlain.balance);
        }

        // await gameInstance.addPlayer(userId);
        res.status(201).json({
          message: `User ${player.id} added to game ${gameId}`,
          player: player,
        });
      } catch (err) {
        await transaction.rollback();
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
          return res
            .status(404)
            .json({ error: `Game with ID ${gameId} not found` });
        }

        await gameInstance.removePlayer(playerId);
        res.json({ message: `Player ${playerId} removed from game ${gameId}` });
      } catch (err) {
        //console.error('Error removing player from game:', err);
        res
          .status(500)
          .json({ error: 'Failed to remove player from the game' });
      }
    },

    // Get by Id

    getGameById: async (req: Request, res: Response) => {
      try {
        const gameId = req.params.id;
        const gameInstance = await game.findByPk(gameId);
        res.json(gameInstance);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch game' });
      }
    },

    getPlayersByGameId: async (req: Request, res: Response) => {
      try {
        const gameId = req.params.id;
        const players = await Player.findAll({
          where: { gameId: gameId },
          attributes: ['id', 'userId', 'balance'],
        });

        if (!players) {
          return res
            .status(404)
            .json({ error: `No players found for game with ID ${gameId}` });
        }
        return res.json(players);
      } catch (err) {
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
          return res
            .status(404)
            .json({ error: `Game with ID ${gameId} not found` });
        }

        const player = await Player.findOne({
          where: {
            id: playerId,
            gameId: gameId,
          },
        });

        if (!player) {
          return res.status(404).json({
            error: `Player with ID ${playerId} not found in game ${gameId}`,
          });
        }

        return res.json(player);
      } catch (err: any) {
        console.error('Error fetching player by ID:', err);
        res
          .status(500)
          .json({ error: 'Failed to fetch player', details: err.message });
      }
    },

    getTradesByGameId: async (req: Request, res: Response) => {
      try {
        const gameId = req.params.id;

        const trades = await Trade.findAll({
          where: { gameId: gameId },
        });

        res.status(200).json(trades);
      } catch (err: any) {
        //console.error('Error fetching trades by game ID:', err);
        res.status(500).json({ error: 'Failed to fetch trades for the game' });
      }
    },

    // CRUD operations //

    // POST /games (Create)
    createGame: async (req: Request, res: Response) => {
      try {
        if (!req.body.name)
          return res.status(400).json({ error: 'name is required' });
        if (!req.body.maxPlayers)
          return res.status(400).json({ error: 'maxPlayers is required' });
        if (!req.body.ownerId)
          return res.status(400).json({ error: 'ownerId is required' });
        const instance = await game.create({
          name: req.body.name,
          description: req.body.description,
          maxPlayers: req.body.maxPlayers,
          ownerId: req.body.ownerId,
          startingBalance: req.body.startingBalance ?? 10000,
          isActive: req.body.isActive ?? true,
          endsAt: req.body.endsAt,
        });
        //console.log('Created game:', instance.toJSON());
        res.status(201).json(instance);
      } catch (err: any) {
        //console.error('Error creating game:', err);
        res.status(400).json({ error: err.message });
      }
    },

    // GET /game/:id/winner
    getWinner: async (req: Request, res: Response) => {
      res.json({ message: 'Not implemented' });
    },

    // POST /game/:id/winner
    declareWinner: async (req: Request, res: Response) => {
      const transaction = await game.sequelize!.transaction();

      try {
        const gameId = req.params.id;
        const gameInstance = await game.findByPk(gameId);
        if (!gameInstance) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ error: `Game with ID ${gameId} not found` });
        }

        const now = new Date();
        const endsAt = gameInstance.endsAt;

        if (now < endsAt) {
          await transaction.rollback();
          return res
            .status(400)
            .json({ error: 'Game is still active. No winner yet.' });
        }

        const players = await Player.findAll({
          where: { gameId: gameId },
          attributes: ['id', 'userId', 'balance'],
        });

        if (!players || players.length === 0) {
          transaction.rollback();
          return res
            .status(404)
            .json({ error: `No players found for game with ID ${gameId}` });
        }

        let highestBalance = -Infinity;
        let winner = players[0];
        for (let i = 0; i < players.length; i++) {
          if (winner.balance < players[i].balance) {
            winner = players[i];
            highestBalance = winner.balance;
          }
        }

        gameInstance.winner = winner.userId;
        gameInstance.isActive = false;
        await gameInstance.save({ transaction });
        await transaction.commit();

        res.status(200).json({
          message: `Winner is player ${winner.id} (User ID: ${winner.userId}) with balance ${winner.balance}`,
          winner: {
            id: winner.id,
            userId: winner.userId,
            balance: winner.balance,
          },
        });
      } catch (err) {
        await transaction.rollback();
        console.error('Error declaring winner:', err);
        res.status(500).json({ error: 'Failed to declare winner' });
      }
    },

    // GET /games (Read)
    getGames: async (req: Request, res: Response) => {
      try {
        console.log('getGames called');
        console.log('Game model:', game);
        console.log('Game.findAll:', typeof game.findAll);

        const games = await game.findAll();
        console.log('Games found:', games);
        console.log(
          'Number of games:',
          games ? games.length : 'null/undefined'
        );

        res.json(games);
      } catch (err: any) {
        console.error('Error in getGames:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({
          error: 'Failed to fetch games',
          details: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
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
            where: { id: req.params.id },
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
          where: { id: gameId },
        });

        if (deletedGame) {
          res.json({ message: `Game ${gameId} deleted` });
        } else {
          res.status(404).json({ error: `Game ${gameId} not found` });
        }
      } catch (err: any) {
        //console.error('Error deleting game:', err);
        res.status(500).json({ error: err.message });
      }
    },
  };
};
