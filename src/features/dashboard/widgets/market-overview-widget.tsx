'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, Plus } from 'lucide-react';
import { useBinancePrices } from '@/hooks/useBinancePrices';
import AssetIcon from '@/components/ui/AssetIcon';
import { useUser, useFirestore } from '@/firebase';
import { addSymbolToWatchlist } from '@/features/watchlists/watchlist-service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const staticStocks = [
    { symbol: 'AAPL', price: 189.65, change: 0.22, type: 'stock' },
    { symbol: 'TSLA', price: 247.32, change: -0.22, type: 'stock' },
    { symbol: 'GOOG', price: 143.39, change: 0.60, type: 'stock' },
    { symbol: 'AMZN', price: 184.74, change: -0.14, type: 'stock' },
];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function MarketOverviewWidget() {
  const { user } = useUser();
  const { prices: binancePrices, isLoading: isCryptoLoading } = useBinancePrices();
  const { toast } = useToast();

  const handleAddToWatchlist = async (symbol: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to add symbols to your watchlist.',
      });
      return;
    }
    try {
      await addSymbolToWatchlist(user.uid, symbol);
      toast({
        title: 'Success',
        description: `${symbol} has been added to your watchlist.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || `Failed to add ${symbol} to watchlist.`,
      });
    }
  };

  const combinedAssets = [
    ...binancePrices.map((c) => ({
      symbol: c.symbol.replace('USDT', ''),
      price: parseFloat(c.lastPrice!),
      change: parseFloat(c.priceChangePercent!),
      type: 'crypto',
    })),
    ...staticStocks,
  ];

  return (
    <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            <span>Combined Market Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {isCryptoLoading ? (
            <div className="space-y-3">
              {Array(8).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-[#191C29]" />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col gap-3"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {combinedAssets.slice(0, 10).map((asset) => (
                <motion.div
                  key={asset.symbol}
                  variants={fadeInUp}
                  className="flex items-center justify-between bg-[#191C29] px-4 py-2 rounded-xl border border-transparent hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3 w-1/4">
                    <AssetIcon symbol={asset.symbol + (asset.type === "crypto" ? "USDT" : "")} size={24} />
                    <span className="font-medium">{asset.symbol}</span>
                  </div>
                  <div className="flex items-center justify-end gap-4 sm:gap-6 flex-1">
                    <span className="text-gray-300 text-sm font-mono w-24 text-right">
                      ${asset.price.toFixed(2)}
                    </span>
                    <span
                      className={cn('font-semibold text-sm font-mono w-20 text-right', asset.change >= 0 ? "text-green-400" : "text-red-400")}
                    >
                      {asset.change.toFixed(2)}%
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddToWatchlist(asset.symbol)}
                      className="px-2 py-1 h-auto text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
    </Card>
  );
}
