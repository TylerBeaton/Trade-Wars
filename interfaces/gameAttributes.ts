import { Trade } from '@/models/tradeModel';
import { Player } from '../models/playerModel';

export interface GameAttributes {
  id?: number;
  name: string;
  description?: string;
  maxPlayers: number;
  ownerId: string;
  startingBalance: number;
  isActive: boolean;
  endsAt: Date;
  players?: Player[];
  trades?: Trade[];
  winner?: number;
}
