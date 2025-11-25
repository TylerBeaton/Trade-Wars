import * as React from 'react';
import Link from 'next/link';
import { PlayerAttributes } from '@/models';

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

interface PlayerListProps {
  players: PlayerAttributes[];
}

export function PlayerList({ players }: PlayerListProps) {
  if (players.length === 0) {
    return <p className="text-gray-500 text-center py-8">No Players Found!</p>;
  } else
    return (
      <Table>
        {/* <TableCaption className="text-2xl font-semibold mt-4 mb-2 caption-top text-left">
            Player List
          </TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>
                <Link
                  href={`/users/${player.userId}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {player.user?.username}
                </Link>
              </TableCell>
              <TableCell>{player.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
