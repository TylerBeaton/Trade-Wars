import * as React from 'react';
import Link from 'next/link';
import { GameAttributes } from '@/models';

// Shadcn UI components
import { PlusIcon, Users, Wallet, ClockFading } from 'lucide-react';

interface GameDetailsProps {
  details: GameAttributes[];
}

export function GameDetails({ details }: GameDetailsProps) {
  if (details.length === 0) {
    return <p className="text-gray-500 text-center py-8">No Details Found!</p>;
  } else
    return (
      <div>
        {details.map((detail) => (
          <div key={detail.id}>
            <ul>
              <li className="flex items-center gap-2">
                <Users className="text-gray-500" />
                <span className="text-sm text-gray-600">Players:</span>
                <span className="font-semibold">
                  {detail.players?.length}/{detail.maxPlayers}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Wallet className="text-gray-500" />
                <span className="text-sm text-gray-600">Starting Balance:</span>
                <span className="font-semibold">{detail.startingBalance}</span>
              </li>
              <li className="flex items-center gap-2">
                <ClockFading className="text-gray-500" />
                <span className="text-sm text-gray-600">Ends At:</span>
                <span className="font-semibold">
                  {new Date(detail.endsAt).toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    );
}
