import { User } from '@/models';
import { GameList } from '@/components/gameList';

export default async function Page() {
  const allUsers = await User.findAll();
  // const gameData = allGames.map((game) => game.toJSON());
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul>
        {allUsers.map((user) => (
          <li key={user.id} className="mb-2">
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
  //return <GameList games={gameData} />;
}
