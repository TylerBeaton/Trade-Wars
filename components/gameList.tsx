import * as React from 'react';
import Link from 'next/link';
import { GameAttributes } from '@/models';

// Shadcn UI components
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface GameListProps {
  games: GameAttributes[];
}

export function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return <p className="text-gray-500 text-center py-8">No games found!</p>;
  } else
    return (
      <div className="w-full">
        <Table>
          {/* <TableCaption className="caption-top text-lg text-left">
            Games
          </TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Max Players</TableHead>
              <TableHead>Starting Balance</TableHead>
              <TableHead>Ends At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <Link
                    href={`/games/${game.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {game.name}
                  </Link>
                </TableCell>
                <TableCell>{game.description}</TableCell>
                <TableCell>{game.maxPlayers}</TableCell>
                <TableCell>{game.startingBalance}</TableCell>
                <TableCell>{new Date(game.endsAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
}
