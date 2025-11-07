'use client';

import { motion } from 'framer-motion';
import { MarketOverviewWidget } from './widgets/market-overview-widget';
import { WatchlistWidget } from './widgets/watchlist-widget';
import { AlertsWidget } from './widgets/alerts-widget';
import { SupportWidget } from './widgets/support-widget';

export function DashboardGrid() {
  return (
    <motion.div
      className="grid gap-6 grid-cols-1 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="lg:col-span-2">
        <MarketOverviewWidget />
      </div>
      <div className="space-y-6">
        <WatchlistWidget />
        <AlertsWidget />
        <SupportWidget />
      </div>
    </motion.div>
  );
}
