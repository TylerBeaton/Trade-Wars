import { Request, Response } from 'express';
import { Trade } from '../models/tradeModel';

const excludedAttributes = ['updatedAt', 'isActive'];

export default (trade: typeof Trade) => {
    return {
        // GET /trades
        getTrades: async (req: Request, res: Response) => {
            try {
                const trades = await trade.findAll(
                    {
                        include: [{
                            association: 'owner',
                            attributes: ['id', 'firstName', 'lastName']
                        }],
                        attributes: { exclude: excludedAttributes }
                    }
                );
                res.json(trades);
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch trades' });
            }
        },

        // GET /trades/:id
        getTradeById: async (req: Request, res: Response) => {
            try {
                const tradeId = req.params.id;
                const tradeInstance = await trade.findByPk(tradeId,
                    {
                        include: [{
                            association: 'owner',
                            attributes: ['id', 'firstName', 'lastName']
                        }],
                        attributes: { exclude: excludedAttributes }
                    });
                res.json(tradeInstance);
            }
            catch (err) {
                res.status(500).json({ error: 'Failed to fetch trade' });
            }
        },

        // POST /trades
        createTrade: async (req: Request, res: Response) => {
            try {
                if (!req.body.ownerId)  return res.status(400).json({ error: 'ownerId is required' });
                if (!req.body.gameId)   return res.status(400).json({ error: 'gameId is required' });
                if (!req.body.stock)    return res.status(400).json({ error: 'stock is required' });
                if (!req.body.price)    return res.status(400).json({ error: 'price is required' });
                if (!req.body.quantity) return res.status(400).json({ error: 'quantity is required' });
                if (!req.body.type)     return res.status(400).json({ error: 'type is required' });
                const instance = await trade.create({
                    ownerId: req.body.ownerId,
                    gameId: req.body.gameId,
                    stock: req.body.stock,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    type: req.body.type,
                    description: req.body.description,
                    isActive: true
                });
                console.log('Created trade:', instance.toJSON());
                res.status(201).json(instance);
            } catch (err: any) {
                console.error('Error creating trade:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // PUT /trade/:id
        updateTrade: async (req: Request, res: Response) => {
            try {
                if (!req.body.ownerId) return res.status(400).json({ error: 'ownerId is required' });
                if (!req.body.stock) return res.status(400).json({ error: 'stock is required' });
                if (!req.body.price) return res.status(400).json({ error: 'price is required' });
                if (!req.body.quantity) return res.status(400).json({ error: 'quantity is required' });
                if (!req.body.type) return res.status(400).json({ error: 'type is required' });

                await trade.update(
                    {
                        ownerId: req.body.ownerId,
                        stock: req.body.stock,
                        price: req.body.price,
                        quantity: req.body.quantity,
                        type: req.body.type,
                        description: req.body.description,
                        isActive: req.body.isActive
                    },
                    {
                        where: { id: req.params.id }
                    }
                );
                const updatedTrade = await trade.findByPk(req.params.id);
                res.json(updatedTrade);
            } catch (err: any) {
                console.error('Error updating trade:', err);
                res.status(400).json({ error: err.message });
            }
        },

        // DELETE /trade/:id
        deleteTrade: async (req: Request, res: Response) => {
            try {
                const tradeId = req.params.id;
                const deletedTrade = await trade.destroy({
                    where: { id: tradeId }
                });

                if (deletedTrade) {
                    res.json({ message: `Trade ${tradeId} deleted` });
                }
                else {
                    res.status(404).json({ error: `Trade ${tradeId} not found` });
                }
            } catch (err: any) {
                console.error('Error deleting trade:', err);
                res.status(500).json({ error: err.message });
            }
        }
    }
}

