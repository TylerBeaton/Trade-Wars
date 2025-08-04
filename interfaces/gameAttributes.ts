export interface GameAttributes {
  id?: number;
  name: string;
  description?: string;
  maxPlayers: number;

  ownerId: number;

  players: number[];

  isActive: boolean;
}