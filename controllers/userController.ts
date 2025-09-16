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
            const transaction = await user.sequelize!.transaction();

            try {
                if (!req.body.firstName) {
                    await transaction.rollback();
                    return res.status(400).json({
                        error: 'firstName is required'
                    })
                };

                if (!req.body.lastName) {
                    await transaction.rollback();
                    return res.status(400).json({
                        error: 'lastName is required'
                    });
                };

                const userInstance = await user.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                }, { transaction }
                );

                await transaction.commit();
                res.status(201).json(userInstance);

            } catch (err: any) {
                // console.error('Error creating user:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // PUT /users/:id
        updateUser: async (req: Request, res: Response) => {
            const transaction = await user.sequelize!.transaction();

            try {
                if (!req.body.firstName || !req.body.lastName) {
                    await transaction.rollback();
                    return res.status(400).json({ error: 'firstName and lastName are required' });
                }
                await user.update(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    },
                    {
                        where: { id: req.params.id },
                        transaction
                    },
                );
                await transaction.commit();
                const updatedUser = await user.findByPk(req.params.id);
                res.json(updatedUser);
            } catch (err: any) {
                res.status(400).json({ error: err.message });
            }
        },

        // DELETE /users/:id
        deleteUser: async (req: Request, res: Response) => {
            const transaction = await user.sequelize!.transaction();
            try {
                const userId = req.params.id;
                const deletedUser = await user.destroy({
                    where: { id: userId },
                    transaction
                });

                if (deletedUser) {
                    await transaction.commit();
                    res.json({ message: `User ${userId} deleted` });
                }
                else {
                    res.status(404).json({ error: `User ${userId} not found` });
                }
            } catch (err: any) {
                // console.error('Error deleting user:', err);
                res.status(500).json({ error: err.message });
            }
        }
    }
}

