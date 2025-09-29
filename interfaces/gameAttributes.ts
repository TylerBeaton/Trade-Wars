export interface GameAttributes {
  id?: number;
  name: string;
  description?: string;
  maxPlayers: number;
  ownerId: number;
  startingBalance: number;
  isActive: boolean;
}
