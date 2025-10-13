import Link from 'next/link';
import { GameAttributes } from '@/models';

interface GameListProps {
  games: GameAttributes[];
}

export function GameList({ games }: GameListProps) {
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
