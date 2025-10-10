import Link from 'next/link';
import { Game } from '@/models';
import { GameList } from './_components/GameList';

export default async function Page() {
  const allGames = await Game.findAll();
  const gameData = allGames.map((game) => game.toJSON());

  return (
    // Create global header/footer components and wrap page content in them
    <div>
      <h1 className="text-4xl">Trade Wars Dashboard</h1>
      <h2>Games List</h2>
      <GameList games={gameData} />
      <h2>Create Game</h2>
      {/* Add a "Create New Game" button linking to the game creation page */}
      <button>
        <Link href="/create">Create New Game</Link>
      </button>
    </div>
  );
}
