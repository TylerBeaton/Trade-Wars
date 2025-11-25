import { Game, Player, User, Trade } from '@/models';
import Link from 'next/link';
import { PlayerList } from '@/components/playerList';
import { TradeList } from '@/components/tradeList';
import { GameDetails } from '@/components/gameDetails';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

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
            attributes: ['id', 'name', 'email', 'username'],
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
                attributes: ['name', 'username'],
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
        attributes: ['id', 'name', 'email', 'username'],
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
            attributes: ['id', 'name', 'username'],
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
      <div className="">
        <h1 className="text-4xl font-bold tracking-tight">{game.name}</h1>
        <h2 className="text-2xl font-thin tracking-normal mb-2">
          {game.description}
        </h2>
      </div>
      <Separator className="my-4" />
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Game Info</AccordionTrigger>
          <AccordionContent>
            <GameDetails details={[game.toJSON()]} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Players</AccordionTrigger>
          <AccordionContent>
            <PlayerList players={playerData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Trades</AccordionTrigger>
          <AccordionContent>
            <TradeList trades={tradeData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button variant="outline" className="my-2">
        <Link href="/games">Back</Link>
      </Button>
    </div>
  );
}
