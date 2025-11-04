import { Game, User, Player } from '../../models';
import { faker } from '@faker-js/faker';

export async function seedPlayers() {
  const users = await User.findAll();
  const games = await Game.findAll();

  for (const game of games) {
    const gameData = game.get({ plain: true });

    const playerCount = faker.number.int({
      min: 2,
      max: Math.min(gameData.maxPlayers, users.length),
    });

    const shuffledUsers = faker.helpers.shuffle([...users]);
    const selectedUsers = shuffledUsers.slice(0, playerCount);

    for (const user of selectedUsers) {
      const userData = user.get({ plain: true });

      const player = await Player.create({
        gameId: gameData.id as number,
        userId: userData.id as number,
        balance: gameData.startingBalance as number,
      });
    }
  }
}
