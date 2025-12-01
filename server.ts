// server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { Auth, auth } from '@/lib/auth';
import next from 'next';
import cors from 'cors';

// Import everything from models/index.ts instead of individual files
import { sequelize, Game, User } from './models'; // This should initialize everything properly

// Import your existing routes
import { gameRouter } from './routes/gameRouter';
import { userRouter } from './routes/userRouter';

const dev = process.env.NODE_ENV !== 'production';
export { dev };
const app = next({ dev });
const handle = app.getRequestHandler();
import { v4 as uuidv4 } from 'uuid';

async function startServer() {
  try {
    await app.prepare();

    const server = express();
    const PORT = process.env.PORT || 3000;

    // Express middleware
    server.use(cors());
    server.use(express.json());

    server.get('/api/auth/test', (req, res) => {
      res.json({
        message: 'Better Auth is configured',
        authEndpoints: [
          '/api/auth/session',
          '/api/auth/sign-in/email',
          '/api/auth/sign-up/email',
          '/api/auth/sign-out',
        ],
      });
    });

    server.all('/api/auth/*', toNodeHandler(Auth)); // Better Auth middleware

    // Debugging middleware
    server.use('/api', (req, res, next) => {
      console.log(`Received ${req.method} request for ${req.path}`);
      next();
    });

    // Verify models before using them
    console.log('Verifying models...');
    console.log('Game model type:', typeof Game);
    console.log('Game model:', Game);
    console.log('Game.findAll exists:', typeof Game.findAll);

    const gameRouterInstance = gameRouter(Game);
    const userRouterInstance = userRouter(User);

    // Your existing API routes
    server.use('/api/games', gameRouterInstance);
    server.use('/api/users', userRouterInstance);

    // Health check
    server.get('/api/health', (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    });

    // Let Next.js handle all other routes
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    // Start server
    await sequelize.sync({ force: false }); // force is now controlled with ./scripts/seed.ts
    console.log('Database sync completed');

    // Temporary route to test Game model

    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
      console.log(
        `> Test game model at http://localhost:${PORT}/api/test-game-model`
      );
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
