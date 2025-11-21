import { seedUsers } from './seeders/01-users';
import { seedGames } from './seeders/02-games';
import { seedPlayers } from './seeders/03-players';
import { seedTrades } from './seeders/04-trades';
import { User, Game, Player, Trade, sequelize } from '../models';

async function seedDatabase(
  userCount: number = 20,
  gameCount: number = 50,
  tradeCountMin: number = 1,
  tradeCountMax: number = 10,
  output: number = 0
) {
  await sequelize.sync({ force: true });
  await seedUsers(userCount);
  await seedGames(gameCount);
  await seedPlayers();
  await seedTrades(tradeCountMin, tradeCountMax);

  if (output === 1) {
    const games = await Game.findAll({
      include: [
        {
          model: Player,
          as: 'players',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    for (const game of games) {
      // List the game and its stats
      console.table({
        id: game.id,
        name: game.name,
        //   description: game.description,
        maxPlayers: game.maxPlayers,
        //   ownerId: game.ownerId,
        startingBalance: game.startingBalance,
        playerCount: game.players.length,
        players:
          game.players.map((p) => `${p.user?.name}`).join(', ') || 'None',
      });

      // List transactions
      const trades = await Trade.findAll({ where: { gameId: game.id } });
      console.table(
        trades.map((t) => ({
          id: t.id,
          ownerId: t.ownerId,
          stock: t.stock,
          price: t.price,
          quantity: t.quantity,
          type: t.type,
          description: t.description,
          isActive: t.isActive,
        }))
      );
    }

    await sequelize.close();
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, number> = {
    userCount: 20,
    gameCount: 20,
    tradeCountMin: 1,
    tradeCountMax: 10,
    output: 0,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = parseInt(args[i + 1]);
      if (!isNaN(value) && key in parsed) {
        parsed[key] = value;
      }
    }
  }

  return parsed;
}

const { userCount, gameCount, tradeCountMin, tradeCountMax, output } =
  parseArgs();

seedDatabase(userCount, gameCount, tradeCountMin, tradeCountMax, output)
  .then(() => {
    console.log('Database seeded successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
