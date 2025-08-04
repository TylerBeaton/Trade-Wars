export interface TradeAttributes {
    id?: number;
    ownerId: number;
    stock: string;
    price: number;
    quantity: number;
    type: 'buy' | 'sell';
    description?: string;
    isActive: boolean;
}