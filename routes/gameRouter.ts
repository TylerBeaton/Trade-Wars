import { Router } from 'express';
import { Game } from '../models/gameModel';
import GameController from '../controllers/gameController';

export const gameRouter = (game: typeof Game) => {
    const router = Router();
    const gameController = GameController(game);

    router.get('/', gameController.getGames);
    router.get('/:id', gameController.getGameById);
    router.get('/:id/players', gameController.getPlayersByGameId);
    router.get('/:id/players/:playerId', gameController.getPlayerInGameById);
    router.get('/:id/trades', gameController.getTradesByGameId);

    router.post('/', gameController.createGame);
    router.post('/:id/players', gameController.addPlayerToGame)
    router.post('/:id/trades', gameController.transactTradeForGame)

    router.put('/:id', gameController.updateGame);
    router.delete('/:id', gameController.deleteGame);

    return router;
};