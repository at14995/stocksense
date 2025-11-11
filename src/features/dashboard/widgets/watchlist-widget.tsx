'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { listenUserWatchlists } from '@/features/watchlists/watchlist-service';
import { Watchlist } from '@/features/watchlists/types';
import { useMarketFeed } from '../hooks/use-market-feed';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { List, Plus } from 'lucide-react';
import AssetIcon from '@/components/ui/AssetIcon';

export function WatchlistWidget() {
  const { user } = useUser();
  const [watchlists, setWatchlists] = useState<Watchlist[] | null>(null);

  // Listen for user watchlists
  useEffect(() => {
    if (!user?.uid) {
      setWatchlists([]);
      return;
    }

    const unsub = listenUserWatchlists(user.uid, lists => {
      setWatchlists(lists);
      console.log("Firestore watchlists:", lists);
    });
    return () => unsub && unsub();
  }, [user?.uid]);

  // Flatten all symbols from watchlists and normalize
  const watchlistSymbols = useMemo(() => {
    if (!watchlists) return [];
    const allSymbols = watchlists.flatMap(w => w.symbols ?? []);
    return Array.from(new Set(allSymbols.map(s => s.trim().toUpperCase()))); // deduplicate & normalize
  }, [watchlists]);

  // Fetch market data
  const { watchlistData, isLoading } = useMarketFeed(
    watchlistSymbols.length > 0 ? watchlistSymbols : null
  );

  // Normalize symbols consistently for matching
  const normalizeSymbol = (s: string) => {
    let val = s.trim().toUpperCase();
    if (val.endsWith('USDT')) val = val.slice(0, -4);
    return val;
  };

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
          {watchlists === null ? (
            // Firestore loading
            <div className="space-y-2">
              <Skeleton className="h-10 w-full bg-[#191C29]" />
              <Skeleton className="h-10 w-full bg-[#191C29]" />
              <Skeleton className="h-10 w-full bg-[#191C29]" />
            </div>
          ) : watchlists.length === 0 ? (
            // No watchlists
            <div className="text-center text-muted-foreground py-8">
              <p>You have no watchlists yet.</p>
              <Button asChild className="mt-4">
                <Link href="/watchlists">Add Watchlist</Link>
              </Button>
            </div>
          ) : watchlistSymbols.length === 0 ? (
            // Watchlists exist but no symbols
            <div className="text-center text-muted-foreground py-8">
              <p>Your watchlists have no symbols.</p>
              <Button asChild className="mt-4">
                <Link href="/watchlists">Add Symbols</Link>
              </Button>
            </div>
          ) : (
            // Watchlists with symbols → render table
            <Table>
              <TableHeader>
                <TableRow className="border-b-white/10">
                  <TableHead>SYMBOL</TableHead>
                  <TableHead className="text-right">LAST PRICE</TableHead>
                  <TableHead className="text-right">24H CHANGE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
  {watchlistSymbols.map((symbol, index) => {
    const market = watchlistData.find(
      item => normalizeSymbol(item.symbol) === normalizeSymbol(symbol)
    );

    // Display short symbol (strip USDT suffix if present)
    const displaySymbol = normalizeSymbol(symbol);

    return (
      <TableRow
        key={symbol}
        className={cn(
          "border-none",
          index % 2 === 0 ? 'bg-[#161925]' : 'bg-[#121521]',
          'hover:bg-[#191C29]'
        )}
      >
        <TableCell className="text-base font-medium">
  <div className="flex items-center gap-2">
    <AssetIcon symbol={displaySymbol} size={24} /> {/* increase icon size too */}
    <span>{displaySymbol}</span>
  </div>
    </TableCell>

    <TableCell className="text-sm font-mono text-right">
  ${market?.price ?? <Skeleton className="h-5 w-20 inline-block bg-[#191C29]" />}
</TableCell>
    <TableCell
      className={cn(
        'text-base font-mono text-right transition-colors duration-500 ease-out',
        (() => {
          const changeValue = parseFloat(market?.change ?? '0');
          return changeValue >= 0 ? 'text-green-400' : 'text-red-400';
        })()
      )}
    >
      {market?.change ?? <Skeleton className="h-5 w-20 inline-block bg-[#191C29]" />}
    </TableCell>
      </TableRow>
    );
  })}
</TableBody>

            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
