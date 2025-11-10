import { useState, useEffect, use } from 'react';
import { GameAttributes } from '@/interfaces/gameAttributes';

export default function Games() {
  const [gameCount, setGameCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (response.ok) {
          const games: GameAttributes[] = await response.json();
          const runningGames = games.filter((game) => game.isActive === true);
          setGameCount(runningGames.length);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);
  return (
    <div>
      <h1>Hello World</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Number of games currently running: {gameCount}</p>
      )}
    </div>
  );
}
