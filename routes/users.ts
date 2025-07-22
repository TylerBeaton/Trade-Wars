import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

export default (user: typeof User) => {
    const router = Router();

    // GET users listing.
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('respond with a resource');
    });

    // POST user creation
    router.post('/', async (req: Request, res: Response) => {
        console.log('Received POST request:', req.body);
        try {
            if (!req.body.firstName || !req.body.lastName) {
                return res.status(400).json({ error: 'firstName and lastName are required' });
            }
            const instance = await user.create({
                id : req.body.id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
            console.log('Created user:', instance.toJSON());
            res.status(201).json(instance);
        } catch (err: any) {
            console.error('Error creating user:', err);
            res.status(400).json({ error: err.message });
        }
    });

    return router;
};
