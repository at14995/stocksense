'use client';

import { useEffect, useState, useMemo } from 'react';
import type { MarketDataItem, OverviewDataItem } from '../types';

const initialOverviewData: OverviewDataItem[] = [
  { symbol: 'BTC/USDT', price: '62,134.00', change: '+1.6%' },
  { symbol: 'ETH/USDT', price: '3,212.00', change: '+0.8%' },
  { symbol: 'AAPL', price: '185.40', change: '-0.4%' },
  { symbol: 'TSLA', price: '255.20', change: '+2.1%' },
];

const initialWatchlistData: MarketDataItem[] = [
    { symbol: 'NVDA', price: '877.35', change: '+2.4%' },
    { symbol: 'GOOGL', price: '170.14', change: '-0.9%' },
    { symbol: 'AMZN', price: '183.63', change: '+1.2%' },
];


export function useMarketFeed(intervalMs = 30000) {
  const [overviewData, setOverviewData] = useState<OverviewDataItem[]>([]);
  const [watchlistData, setWatchlistData] = useState<MarketDataItem[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load with a delay to show skeletons
    const initialLoadTimer = setTimeout(() => {
        setOverviewData(initialOverviewData);
        setWatchlistData(initialWatchlistData);
        setLastRefresh(Date.now());
        setIsLoading(false);
    }, 1000);

    const interval = setInterval(() => {
      setOverviewData((prevData) =>
        prevData.map((item) => {
          const currentPrice = parseFloat(item.price.replace(/,/g, ''));
          const change = (Math.random() - 0.5) * (currentPrice * 0.01);
          const newPrice = currentPrice + change;
          const newChangePercent = (change / currentPrice) * 100;
          return {
            ...item,
            price: newPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
            change: `${newChangePercent >= 0 ? '+' : ''}${newChangePercent.toFixed(1)}%`,
          };
        })
      );
      setWatchlistData((prevData) =>
        prevData.map((item) => {
          const currentPrice = parseFloat(item.price.replace(/,/g, ''));
          const change = (Math.random() - 0.5) * (currentPrice * 0.01);
          const newPrice = currentPrice + change;
          const newChangePercent = (change / currentPrice) * 100;
          return {
            ...item,
            price: newPrice.toFixed(2),
            change: `${newChangePercent >= 0 ? '+' : ''}${newChangePercent.toFixed(1)}%`,
          };
        })
      );
      setLastRefresh(Date.now());
    }, intervalMs);

    return () => {
        clearTimeout(initialLoadTimer);
        clearInterval(interval);
    }
  }, [intervalMs]);

  return useMemo(() => ({
    overviewData,
    watchlistData,
    lastRefresh,
    isLoading,
  }), [overviewData, watchlistData, lastRefresh, isLoading]);
}
