'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, Bitcoin } from 'lucide-react';
import { useMarketFeed } from '../hooks/use-market-feed';
import { useBinancePrices, type BinancePrice } from '@/hooks/useBinancePrices';

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const usdtPairsToShow = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT'];

export function MarketOverviewWidget() {
  const { overviewData, isLoading: isStockLoading } = useMarketFeed();
  const { prices: binancePrices, isLoading: isCryptoLoading } = useBinancePrices();

  const filteredCryptoPrices = binancePrices
    .filter(p => usdtPairsToShow.includes(p.symbol))
    .sort((a, b) => usdtPairsToShow.indexOf(a.symbol) - usdtPairsToShow.indexOf(b.symbol));

  const renderCryptoPrice = (pair: BinancePrice) => (
    <motion.div 
      key={pair.symbol} 
      variants={fadeInUp}
      className="bg-[#191C29] border border-gray-700/60 rounded-lg p-3 transition-transform hover:-translate-y-1"
    >
      <p className="font-semibold text-sm text-gray-400">{pair.symbol.replace('USDT', '/USDT')}</p>
      <p className="text-xl font-bold font-mono text-indigo-400">${parseFloat(pair.price).toFixed(2)}</p>
    </motion.div>
  );

  return (
    <div className="2xl:col-span-2 grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            <span>Stock Market Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isStockLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full bg-[#191C29]" />
              <Skeleton className="h-20 w-full bg-[#191C29]" />
              <Skeleton className="h-20 w-full bg-[#191C29]" />
              <Skeleton className="h-20 w-full bg-[#191C29]" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {overviewData.map((item) => (
                <motion.div 
                  key={item.symbol} 
                  variants={fadeInUp}
                  className="bg-[#191C29] border border-gray-700/60 rounded-lg p-4 transition-transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm">{item.symbol}</p>
                    <p
                      className={cn(
                        'text-sm font-semibold transition-colors duration-500 ease-out',
                        item.change.startsWith('+')
                          ? 'text-green-400'
                          : 'text-red-400'
                      )}
                    >
                      {item.change}
                    </p>
                  </div>
                  <p className="text-2xl font-bold font-mono">{item.price}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
         <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bitcoin className="h-5 w-5" />
            <span>Live Crypto Prices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            {isCryptoLoading ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full bg-[#191C29]" />
                    ))}
                </div>
            ) : filteredCryptoPrices.length > 0 ? (
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                >
                    {filteredCryptoPrices.map(renderCryptoPrice)}
                </motion.div>
            ) : (
                <p className="text-center text-muted-foreground py-4">Could not load crypto prices.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
