import { Game, Player, User, Trade } from '@/models';
import Link from 'next/link';
import { PlayerList } from '@/components/playerList';

export default async function Page({ params }) {
  const parsedParams = await params;
  const game = await Game.findByPk(parsedParams.id, {
    include: [
      {
        model: Player,
        as: 'players',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: Trade,
        as: 'trades',
        include: [
          {
            model: Player,
            as: 'owner',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName'],
              },
            ],
          },
        ],
      },
    ],
  });

  const allPlayers = await Player.findAll({
    where: game ? { gameId: game.id } : {},
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email'],
      },
    ],
  });

  if (!game) {
    return <div>Game not found</div>;
  }

  const players = game.players || [];
  const playerData = allPlayers.map((player) => player.toJSON());

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">{game.name}</h1>
      <p className="text-2xl font-thin tracking-normal mb-2">
        {game.description}
      </p>
      <p>Max Players: {game.maxPlayers}</p>
      <p>Starting Balance: {game.startingBalance}</p>
      <p>Ends At: {new Date(game.endsAt).toLocaleString()}</p>
      Players ({players.length}/{game.maxPlayers})
      <h2 className="text-2xl font-semibold mt-4 mb-2">Player List:</h2>
      <PlayerList players={playerData} />
      <Link href="/games">Back to games list!</Link>
    </div>
  );
}
