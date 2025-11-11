import Link from 'next/link';
import { Game } from '@/models';
// import { GameList } from '@/components/gameList';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import AppBarchart from '@/components/appbarchart';

export default async function Page() {
  const allGames = await Game.findAll();
  const gameData = allGames.map((game) => game.toJSON());

  return (
    // Create global header/footer components and wrap page content in them
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarchart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"></div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      {/* <ModeToggle />
      <h1 className="text-4xl">Trade Wars Dashboard</h1>
      <h2>Games List</h2>
      <GameList games={gameData} />
      <h2>Create Game</h2> */}
      {/* Add a "Create New Game" button linking to the game creation page */}
      {/* <Button>
        <Link href="/create">Create New Game</Link>
      </Button> */}
    </div>
  );
}
