'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useMarketFeed } from '../hooks/use-market-feed';

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export function MarketOverviewWidget() {
  const { overviewData, isLoading } = useMarketFeed();

  return (
    <Card className="2xl:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          <span>Market Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {overviewData.map((item) => (
              <motion.div key={item.symbol} variants={fadeInUp}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-sm">{item.symbol}</p>
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          item.change.startsWith('+')
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                        {item.change}
                      </p>
                    </div>
                    <p className="text-2xl font-bold">{item.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
