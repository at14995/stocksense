'use client';

import { motion } from 'framer-motion';
import { MarketOverviewWidget } from './widgets/market-overview-widget';
import { WatchlistWidget } from './widgets/watchlist-widget';
import { SentimentPreviewWidget } from './widgets/sentiment-preview-widget';
import { AlertsWidget } from './widgets/alerts-widget';
import { SupportWidget } from './widgets/support-widget';

export function DashboardGrid() {
  return (
    <motion.div
      className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MarketOverviewWidget />
      <WatchlistWidget />
      <SentimentPreviewWidget />
      <AlertsWidget />
      <SupportWidget />
    </motion.div>
  );
}
