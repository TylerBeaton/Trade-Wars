import { Router } from 'express';
import { userRouter } from './userRouter';
import { gameRouter } from './gameRouter';
import { User } from '../models/userModel';
import { Game } from '../models/gameModel';

const router = Router();

// Mount routes with /api prefix

router.use('/users', userRouter(User));
router.use('/games', gameRouter(Game));

export default router;
