import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import UserController from '../controllers/userController';

export const userRouter = (user: typeof User) => {
    const router = Router();
    const userController = UserController(user);

    router.get('/', userController.getUsers);
    router.get('/:id', userController.getUserById);

    router.post('/', userController.createUser);
    router.put('/:id', userController.updateUser);
    router.delete('/:id', userController.deleteUser);

    return router;
};