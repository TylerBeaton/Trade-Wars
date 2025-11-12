import { Game } from '@/models';
import { GameList } from '@/components/gameList';

export default async function Page() {
  const allGames = await Game.findAll();
  const gameData = allGames.map((game) => game.toJSON());

  return <GameList games={gameData} />;
}
