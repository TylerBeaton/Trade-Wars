import dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const dev = process.env.NODE_ENV !== 'production';

if (dev) {
  console.log('FROM AUTH.TS FILE', dev);

  console.log('Better Auth DB Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
  }); // Debug log
}

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
