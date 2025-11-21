import { betterAuth } from 'better-auth';
import { sequelize } from '@/models';
import postgres from 'pg';

const { Pool } = postgres;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
});

export type Session = typeof auth.$Infer.Session;
