'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useBinancePrices } from '@/hooks/useBinancePrices';
import AssetIcon from '@/components/ui/AssetIcon';
import { useUser } from '@/firebase';
import { addSymbolToWatchlist } from '@/features/watchlists/watchlist-service';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

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
  const [addedSymbol, setAddedSymbol] = useState('');

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
      setAddedSymbol(symbol);
      setTimeout(() => setAddedSymbol(""), 2500);
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
      symbol: c.symbol,                       // BTCUSDT
      displaySymbol: c.symbol.replace('USDT', ''), // BTC (for text)
      price: parseFloat(c.lastPrice!),
      change: parseFloat(c.priceChangePercent!),
      type: 'crypto',
    })),
    ...staticStocks.map((s) => ({
      ...s,
      displaySymbol: s.symbol, // keep same as symbol for stocks
    })),
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
                  <AssetIcon symbol={asset.displaySymbol} size={24} />
                  <span className="font-medium">{asset.displaySymbol}</span>

                  </div>

                  <div className="flex items-center justify-end gap-4 sm:gap-6 w-2/4 text-right">
                    <span className="text-gray-300 text-sm font-mono w-24 text-right">
                      ${asset.price.toFixed(2)}
                    </span>
                    <span
                      className={cn('font-semibold text-sm font-mono w-20 text-right', asset.change >= 0 ? "text-green-400" : "text-red-400")}
                    >
                      {asset.change.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-end w-1/4">
                    {addedSymbol === asset.symbol ? (
                        <button
                          disabled
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600/30 text-green-300 text-xs font-medium cursor-default transition-all duration-300"
                        >
                          ✓ Added
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddToWatchlist(asset.symbol)}
                          className="group flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white text-xs font-medium shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 active:scale-[0.98]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add</span>
                        </button>
                      )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
    </Card>
  );
}
