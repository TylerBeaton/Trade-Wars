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

    // Add this to your server.ts temporarily
    server.get('/api/setup-default-user', async (req, res) => {
      try {
        // Check if default user exists
        let defaultUser = await User.findOne({ where: { id: 1 } });

        if (!defaultUser) {
          defaultUser = await User.create({
            id: 1,
            firstName: 'Default',
            lastName: 'User',
            // Add any other required fields
          });
          console.log('Default user created:', defaultUser.toJSON());
        }

        res.json({ message: 'Default user ready', user: defaultUser });
      } catch (error: any) {
        console.error('Setup default user failed:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Let Next.js handle all other routes
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    // Start server
    await sequelize.sync({ force: false });
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
