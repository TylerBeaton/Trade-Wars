import { Player } from '../models/playerModel';

export interface GameAttributes {
  id?: number;
  name: string;
  description?: string;
  maxPlayers: number;
  ownerId: number;
  startingBalance: number;
  isActive: boolean;
  endsAt: Date;
  players?: Player[];
  winner?: number;
}
