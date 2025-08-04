export interface GameAttributes {
  id?: number;
  name: string;
  description?: string;
  maxPlayers: number;

  ownerId: number;

  players: number[];
  trades: number[];

  isActive: boolean;
}