'use client';

import { useEffect, useState, useMemo } from 'react';
import type { MarketDataItem, OverviewDataItem } from '../types';

const dummyOverviewData: OverviewDataItem[] = [
  { symbol: 'AAPL', price: '189.23', change: '+1.12%' },
  { symbol: 'TSLA', price: '247.86', change: '-0.45%' },
  { symbol: 'GOOG', price: '142.54', change: '+0.72%' },
  { symbol: 'AMZN', price: '185.00', change: '+0.25%' },
];

const dummyWatchlistData: MarketDataItem[] = [
    { symbol: "BTC/USDT", price: '67123.00', change: '+2.14%' },
    { symbol: "ETH/USDT", price: '3264.10', change: '-1.33%' },
    { symbol: "SOL/USDT", price: '150.75', change: '+5.50%' },
];

const updateDummyData = (data: MarketDataItem[]) => {
    return data.map(item => {
        const currentPrice = parseFloat(item.price.replace(/,/g, ''));
        const changeFactor = (Math.random() - 0.5) * 0.02; // up to 1% change
        const newPrice = currentPrice * (1 + changeFactor);
        const newChangePercent = (newPrice - currentPrice) / currentPrice * 100;
        return {
            ...item,
            price: newPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
            change: `${newChangePercent >= 0 ? '+' : ''}${newChangePercent.toFixed(2)}%`,
        };
    });
};


export function useMarketFeed(symbols: string[] | null = null, intervalMs = 5000) {
  const [overviewData, setOverviewData] = useState<OverviewDataItem[]>([]);
  const [watchlistData, setWatchlistData] = useState<MarketDataItem[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load with a delay to show skeletons
    const initialLoadTimer = setTimeout(() => {
        setOverviewData(dummyOverviewData);
        setWatchlistData(dummyWatchlistData);
        setLastRefresh(Date.now());
        setIsLoading(false);
    }, 1000);

    const interval = setInterval(() => {
      setOverviewData(prevData => updateDummyData(prevData));
      setWatchlistData(prevData => updateDummyData(prevData));
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
