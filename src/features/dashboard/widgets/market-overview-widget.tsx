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
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function MarketOverviewWidget() {
  const { overviewData, isLoading } = useMarketFeed();

  return (
    <div className="2xl:col-span-2">
      <Card className="bg-[#121521]/95 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            <span>Market Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
    </div>
  );
}
