// types/index.ts (move from your models or create new)
export interface Game {
  id: number;
  name: string;
  description: string;
  maxPlayers: number;
  ownerId: number;
  startingBalance: number;
  isActive: boolean;
  endsAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Player {
  id: number;
  userId: number;
  balance: number;
  gameId: number;
}

export interface Trade {
  id: number;
  ownerId: number;
  gameId: number;
  stock: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  description?: string;
  isActive: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
