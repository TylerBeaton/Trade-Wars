import { Router } from 'express';
import { Trade } from '../models/tradeModel';
import TradeController from '../controllers/tradeController';

export const tradeRouter = (trade: typeof Trade) => {
    const router = Router();
    const tradeController = TradeController(trade);

    router.get('/', tradeController.getTrades);
    router.get('/:id', tradeController.getTradeById);

    router.post('/', tradeController.createTrade);
    router.put('/:id', tradeController.updateTrade);
    router.delete('/:id', tradeController.deleteTrade);

    return router;
};