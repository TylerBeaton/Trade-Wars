import { Router } from 'express';
import { Game } from '../models/gameModel';
import GameController from '../controllers/gameController';

export const gameRouter = (game: typeof Game) => {
    const router = Router();
    const gameController = GameController(game);

    router.get('/', gameController.getGames);
    router.get('/:id', tradeController.getTradeById);

    router.post('/', tradeController.createTrade);
    router.put('/:id', tradeController.updateTrade);
    router.delete('/:id', tradeController.deleteTrade);

    return router;
};