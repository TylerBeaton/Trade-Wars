import { Router } from 'express';
import { userRouter } from './userRouter';
import { tradeRouter } from './tradeRouter';
import { User } from '../models/userModel';
import { Trade } from '../models/tradeModel';

const router = Router();

// Mount routes with /api prefix

router.use('/users', userRouter(User));
router.use('/trades', tradeRouter(Trade))


export default router;