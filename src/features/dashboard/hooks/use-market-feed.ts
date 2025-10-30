'use client';

import { useEffect, useState, useMemo } from 'react';
import type { MarketDataItem, OverviewDataItem } from '../types';

const initialOverviewData: OverviewDataItem[] = [
  { symbol: 'BTC/USDT', price: '62,134.00', change: '+1.6%' },
  { symbol: 'ETH/USDT', price: '3,212.00', change: '+0.8%' },
  { symbol: 'AAPL', price: '185.40', change: '-0.4%' },
  { symbol: 'TSLA', price: '255.20', change: '+2.1%' },
];

const generateInitialData = (symbols: string[]): MarketDataItem[] => {
    return symbols.map(symbol => ({
        symbol,
        price: (Math.random() * 1000).toFixed(2),
        change: `${(Math.random() * 10 - 5).toFixed(1)}%`
    }));
}


export function useMarketFeed(symbols: string[], intervalMs = 30000) {
  const [overviewData, setOverviewData] = useState<OverviewDataItem[]>([]);
  const [watchlistData, setWatchlistData] = useState<MarketDataItem[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load with a delay to show skeletons
    const initialLoadTimer = setTimeout(() => {
        setOverviewData(initialOverviewData);
        setWatchlistData(generateInitialData(symbols));
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
  }, [intervalMs, symbols]);

  // If symbols change, we need to regenerate the watchlist data
  useEffect(() => {
    setWatchlistData(generateInitialData(symbols));
  }, [symbols]);

  return useMemo(() => ({
    overviewData,
    watchlistData,
    lastRefresh,
    isLoading,
  }), [overviewData, watchlistData, lastRefresh, isLoading]);
}
