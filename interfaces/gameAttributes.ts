export interface GameAttributes {
  id: string;
  name: string;
  description?: string;
  maxPlayers: number;

  authorId: number;

  players: number[];
  trades: number[];

  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}