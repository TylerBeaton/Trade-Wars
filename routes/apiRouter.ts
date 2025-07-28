import { Router } from 'express';
import { userRouter } from './userRouter';
import { User } from '../models/userModel';

const router = Router();

// Mount routes with /api prefix

router.use('/users', userRouter(User));


export default router;