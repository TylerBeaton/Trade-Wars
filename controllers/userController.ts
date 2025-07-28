import { Request, Response } from 'express';
import { User } from '../models/userModel';

export default (user: typeof User) => {
    return {
        // GET /users
        getUsers: async (req: Request, res: Response) => {
            try {
                const users = await user.findAll();
                res.json(users);
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch users' });
            }
        },

        // GET /users/:id
        getUserById: async (req: Request, res: Response) => {
            try {
                const userId = req.params.id;
                const userInstance = await user.findByPk(userId);
                res.json(userInstance);
            }
            catch (err) {
                res.status(500).json({ error: 'Failed to fetch user' });
            }
        },

        // POST /users
        createUser: async (req: Request, res: Response) => {
            try {
                if (!req.body.firstName || !req.body.lastName) {
                    return res.status(400).json({ error: 'firstName and lastName are required' });
                }
                const instance = await user.create({
                    id: req.body.id,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                });
                console.log('Created user:', instance.toJSON());
                res.status(201).json(instance);
            } catch (err: any) {
                console.error('Error creating user:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // PUT /users/:id
        updateUser: async (req: Request, res: Response) => {
            try {
                if (!req.body.firstName || !req.body.lastName) {
                    return res.status(400).json({ error: 'firstName and lastName are required' });
                }
                await user.update(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    },
                    {
                        where: { id: req.params.id }
                    }
                );
                const updatedUser = await user.findByPk(req.params.id);
                res.json(updatedUser);
            } catch (err: any) {
                console.error('Error updating user:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // DELETE /users/:id
        deleteUser: async (req: Request, res: Response) => {
            try {
                const userId = req.params.id;
                const deletedUser = await user.destroy({
                    where: { id: userId }
                });

                if (deletedUser) {
                    res.json({ message: `User ${userId} deleted` });
                }
                else {
                    res.status(404).json({ error: `User ${userId} not found` });
                }
            } catch (err: any) {
                console.error('Error deleting user:', err);
                res.status(500).json({ error: err.message });
            }
        }
    }
}

