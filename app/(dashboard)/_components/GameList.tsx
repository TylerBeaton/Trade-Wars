import * as React from 'react';
import Link from 'next/link';
import { GameAttributes } from '@/models';

// Shadcn UI components
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';

interface GameListProps {
  games: GameAttributes[];
}

export function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return <p className="text-gray-500 text-center py-8">No games found!</p>;
  } else
    return (
      <ItemGroup>
        {games.map((game) => (
          <React.Fragment key={game.id}>
            <div className="flex w-full max-w-md flex-col gap-6">
              <Item variant="outline" asChild>
                <Link href={`/games/${game.id}`}>
                  <ItemContent>
                    <ItemTitle>{game.name}</ItemTitle>
                    <ItemDescription>{game.description}</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            </div>
          </React.Fragment>
        ))}
      </ItemGroup>
    );
}

export function GameList0({ games }: GameListProps) {
  if (games.length === 0) {
    return <p className="text-gray-500 text-center py-8">No games found!</p>;
  } else
    return (
      <div>
        <ul>
          <div className="max-w-2xl mx-auto space-y-8">
            {games.map((game) => (
              <li
                key={game.id}
                className="p-6 border rounded-lg hover:shadow-lg transition"
              >
                <Link href={`/games/${game.id}`}>
                  <h2>{game.name}</h2>
                </Link>
                <p>{game.description}</p>
                <small>{game.endsAt.toDateString()}</small>
              </li>
            ))}
          </div>
        </ul>
      </div>
    );
}
