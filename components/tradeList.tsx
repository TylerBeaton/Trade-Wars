import * as React from 'react';
import Link from 'next/link';
import { TradeAttributes } from '@/models';

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

interface TradeListProps {
  trades: TradeAttributes[];
}

export function TradeList({ trades: trades }: TradeListProps) {
  if (trades.length === 0) {
    return <p className="text-gray-500 text-center py-8">No Trades Found!</p>;
  } else
    return (
      <Table>
        {/* <TableCaption className="text-2xl font-semibold mt-4 mb-2 caption-top text-left">
          Trade List
        </TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>
                <Link
                  href={`/users/${trade.ownerId}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {trade.owner?.user?.firstName} {trade.owner?.user?.lastName}
                </Link>
              </TableCell>
              <TableCell>{trade.stock}</TableCell>
              <TableCell>{trade.price}</TableCell>
              <TableCell>{trade.quantity}</TableCell>
              <TableCell>{trade.type}</TableCell>
              <TableCell>
                {trade.createdAt
                  ? new Date(trade.createdAt).toLocaleString()
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
