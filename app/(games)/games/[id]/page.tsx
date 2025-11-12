import { Game, Player, User, Trade } from '@/models';
import Link from 'next/link';
import { PlayerList } from '@/components/playerList';
import { TradeList } from '@/components/tradeList';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

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

  const allTrades = await Trade.findAll({
    where: game ? { gameId: game.id } : {},
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
  });

  if (!game) {
    return <div>Game not found</div>;
  }

  const playerData = allPlayers.map((player) => player.toJSON());
  const tradeData = allTrades.map((trade) => trade.toJSON());

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">{game.name}</h1>
      <p className="text-2xl font-thin tracking-normal mb-2">
        {game.description}
      </p>
      <p>Max Players: {game.maxPlayers}</p>
      <p>Starting Balance: {game.startingBalance}</p>
      <p>Ends At: {new Date(game.endsAt).toLocaleString()}</p>
      Players ({playerData.length}/{game.maxPlayers})
      <Separator className="my-4" />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Players</AccordionTrigger>
          <AccordionContent>
            <PlayerList players={playerData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Trades</AccordionTrigger>
          <AccordionContent>
            <TradeList trades={tradeData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Link href="/games">Back to games list!</Link>
    </div>
  );
}
