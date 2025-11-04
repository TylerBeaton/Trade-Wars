import { seedUsers } from './seeders/01-users';
import { seedGames } from './seeders/02-games';
import { seedPlayers } from './seeders/03-players';
import { User, Game, Player, Trade, sequelize } from '../models';

async function seedDatabase(userCount: number = 20, gameCount: number = 100) {
  await sequelize.sync({ force: true });
  await seedUsers(userCount);
  await seedGames(gameCount);
  await seedPlayers();

  const games = await Game.findAll({
    include: [
      {
        model: Player,
        as: 'players',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName'],
          },
        ],
      },
    ],
  });

  console.table(
    games.map((g) => {
      return {
        id: g.id,
        name: g.name,
        description: g.description,
        maxPlayers: g.maxPlayers,
        ownerId: g.ownerId,
        startingBalance: g.startingBalance,
        playerCount: g.players?.length || 0,
        players:
          g.players
            ?.map((p) => `${p.user?.firstName} ${p.user?.lastName}`)
            .join(', ') || 'None',
      };
    })
  );

  await sequelize.close();
}

seedDatabase()
  .then(() => {
    console.log('Database seeded successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
