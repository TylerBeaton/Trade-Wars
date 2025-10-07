import { Game } from '../../models';

export default async function Page() {
  const allGames = await Game.findAll();
  return (
    <ul>
      {allGames.map((game) => (
        <li key={game.id}>{game.description}</li>
      ))}
    </ul>
  );
}
