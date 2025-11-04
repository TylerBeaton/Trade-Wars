// server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import next from 'next';
import cors from 'cors';

// Import everything from models/index.ts instead of individual files
import { sequelize, Game, User } from './models'; // This should initialize everything properly

// Import your existing routes
import { gameRouter } from './routes/gameRouter';
import { userRouter } from './routes/userRouter';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();

    const server = express();
    const PORT = process.env.PORT || 3000;

    // Express middleware
    server.use(cors());
    server.use(express.json());

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

    if (dev) {
      try {
        // Check if default user exists
        let defaultUser = await User.findOne({ where: { id: 1 } });

        if (!defaultUser) {
          defaultUser = await User.create({
            id: 1,
            firstName: 'Default',
            lastName: 'User',
            email: 'default@example.com',
            password: 'password123',
          });
          console.log('Default user created:', defaultUser.toJSON());
        }
      } catch (error: any) {
        console.error('Setup default user failed:', error);
      }
    }

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
