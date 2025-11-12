import { Game, Player, Trade } from '../../models';
import { faker } from '@faker-js/faker';
import tickerData from '../../data/nasdaq_tickers.json';

export async function seedTrades(
  tradeCountMin: number = 1,
  tradeCountMax: number = 10
) {
  const games = await Game.findAll();

  for (const game of games) {
    const players = await Player.findAll({ where: { gameId: game.id } });

    for (const player of players) {
      for (
        let i = 0;
        i < faker.number.int({ min: tradeCountMin, max: tradeCountMax });
        i++
      ) {
        const type = faker.helpers.arrayElement(['buy', 'sell']);
        const price = faker.number.float({
          min: 1,
          max: 100,
          fractionDigits: 2,
        });
        let quantity = faker.number.int({ min: 1, max: 1000 });
        if (type === 'buy') {
          while (price * quantity > player.balance) {
            quantity = faker.number.int({ min: 1, max: 1000 });
          }
          player.balance -= price * quantity;
        } else {
          player.balance += price * quantity;
        }
        await player.save();
        const stock = faker.helpers.arrayElement(tickerData);
        await Trade.create({
          ownerId: player.id,
          gameId: game.id,
          stock: stock,
          price: price,
          quantity: quantity,
          type: faker.helpers.arrayElement(['buy', 'sell']),
          description: faker.lorem.sentence(),
          isActive: true,
        });
      }
    }
  }
}
