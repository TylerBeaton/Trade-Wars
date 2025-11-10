import { Game } from '@/models';
import Link from 'next/link';

export default async function Page({ params }) {
  const parsedParams = await params;
  const game = await Game.findByPk(parsedParams.id);
  if (!game) {
    return <div>Game not found</div>;
  }
  return (
    <div>
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <p>Max Players: {game.maxPlayers}</p>
      <p>Starting Balance: {game.startingBalance}</p>
      <p>Ends At: {new Date(game.endsAt).toLocaleString()}</p>
      <Link href="/">Back to games list</Link>
    </div>
  );
}
