import Link from 'next/link';
import { Game } from '@/models';
import { GameList } from '@/components/gameList';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import AppBarchart from '@/components/appbarchart';

export default async function Page() {
  const allGames = await Game.findAll();
  const gameData = allGames.map((game) => game.toJSON());

  return (
    // Create global header/footer components and wrap page content in them
    <GameList games={gameData} />
  );
}
