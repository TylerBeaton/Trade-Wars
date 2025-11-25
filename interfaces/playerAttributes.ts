import { UserAttributes } from './userAttributes';

export interface PlayerAttributes {
  id?: number;
  userId: string;
  gameId: number;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes;
}
