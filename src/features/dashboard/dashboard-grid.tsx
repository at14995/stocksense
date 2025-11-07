'use client';

import { motion } from 'framer-motion';
import { MarketOverviewWidget } from './widgets/market-overview-widget';
import { WatchlistWidget } from './widgets/watchlist-widget';
import { AlertsWidget } from './widgets/alerts-widget';
import { SupportWidget } from './widgets/support-widget';

export function DashboardGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:col-span-2">
        <MarketOverviewWidget />
      </div>
      <div className="space-y-6 flex flex-col">
        <WatchlistWidget />
        <AlertsWidget />
        <SupportWidget />
      </div>
    </motion.div>
  );
}
