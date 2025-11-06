'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { List, Plus } from 'lucide-react';
import { useMarketFeed } from '../hooks/use-market-feed';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { listenUserWatchlists } from '@/features/watchlists/watchlist-service';
import Link from 'next/link';
import { Watchlist } from '@/features/watchlists/types';

export function WatchlistWidget() {
  const { user } = useUser();
  const [watchlists, setWatchlists] = useState<Watchlist[] | null>(null);
  
  const watchlistSymbols = watchlists?.[0]?.symbols ?? [];

  const { watchlistData, isLoading } = useMarketFeed(watchlistSymbols);

  useEffect(() => {
    if (!user) {
        setWatchlists([]);
        return;
    }
    const unsub = listenUserWatchlists(user.uid, lists => {
      setWatchlists(lists);
    });
    return () => unsub && unsub();
  }, [user]);

  const showLoading = isLoading || watchlists === null;

  return (
    <div className="xl:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <List className="h-5 w-5" />
            <span>My Watchlist</span>
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/watchlists">
              <Plus className="h-4 w-4 mr-2" />
              Manage
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {showLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full bg-[#191C29]" />
              <Skeleton className="h-10 w-full bg-[#191C29]" />
              <Skeleton className="h-10 w-full bg-[#191C29]" />
            </div>
          ) : watchlistData.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>You have no items in your primary watchlist.</p>
              <Button asChild className="mt-4">
                  <Link href="/watchlists">Add Symbols</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-white/10">
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Last Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistData.map((item, index) => (
                  <TableRow key={item.symbol} className={cn("border-none", index % 2 === 0 ? 'bg-[#161925]' : 'bg-[#121521]', 'hover:bg-[#191C29]')}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell className="text-right font-mono">{item.price}</TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono transition-colors duration-500 ease-out',
                        item.change.startsWith('+')
                          ? 'text-green-400'
                          : 'text-red-400'
                      )}
                    >
                      {item.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
