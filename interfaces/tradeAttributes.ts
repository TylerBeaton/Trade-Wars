import { PlayerAttributes } from './playerAttributes';

export interface TradeAttributes {
  id?: number;
  ownerId: number;
  gameId: number;
  stock: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  description?: string;
  isActive: boolean;
  owner?: PlayerAttributes;
  createdAt?: Date;
  updatedAt?: Date;
}
