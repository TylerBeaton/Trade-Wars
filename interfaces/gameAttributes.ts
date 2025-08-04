export interface GameAttributes {
  id?: number;
  name: string;
  description?: string;
  maxPlayers: number;
  ownerId: number;
  isActive: boolean;
}