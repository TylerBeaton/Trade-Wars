import { Game, User } from '../../models';
import { faker } from '@faker-js/faker';

export async function seedGames(numGames: number) {
  const users = await User.findAll();

  for (let i = 0; i < numGames; i++) {
    await Game.create({
      name: faker.lorem.words({ min: 1, max: 2 }),
      description: faker.lorem.sentence({ min: 3, max: 5 }),
      maxPlayers: faker.number.int({ min: 4, max: 10 }),
      ownerId: users[faker.number.int({ min: 0, max: users.length - 1 })]
        .dataValues.id as number,
      startingBalance: faker.number.float({ min: 5000, max: 100000 }),
      isActive: faker.datatype.boolean(),
      endsAt: faker.date.future(),
    });
  }
}
