import { Router } from 'express';
import { Game } from '../models/gameModel';
import GameController from '../controllers/gameController';

export const gameRouter = (game: typeof Game) => {
    const router = Router();
    const gameController = GameController(game);

    router.get('/', gameController.getGames);
    router.get('/:id', gameController.getGamesById);

    router.post('/', gameController.createGame);
    router.put('/:id', gameController.updateGame);
    router.delete('/:id', gameController.deleteGame);

    return router;
};