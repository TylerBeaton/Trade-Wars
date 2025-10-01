// pages/index.tsx
import { useState, useEffect } from 'react';
import type { Game } from '../types/index';

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div className="p-8">Loading games...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Trade Wars Dashboard</h1>
      <div className="grid gap-4">
        {games.length === 0 ? (
          <p>No games found. Create your first game!</p>
        ) : (
          games.map((game: Game) => (
            <div key={game.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{game.name}</h3>
              <p className="text-gray-600">{game.description}</p>
              <p className="text-sm text-gray-500">
                Max Players: {game.maxPlayers} | Starting Balance: $
                {game.startingBalance}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
