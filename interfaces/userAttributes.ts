export interface UserAttributes {
  id: string;
  name: string;
  username?: string; // Managed by better-auth, optional for Sequelize
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
