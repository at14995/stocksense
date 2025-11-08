'use client';

import { useEffect, useState, useMemo } from 'react';
import type { MarketDataItem, OverviewDataItem } from '../types';

/**
 * Example static stock data (replace with a stock API if you want live prices)
 */
const staticStocks: MarketDataItem[] = [
  { symbol: 'AAPL', price: '189.65', change: '0.22%' },
  { symbol: 'TSLA', price: '247.32', change: '-0.22%' },
  { symbol: 'GOOG', price: '143.39', change: '0.60%' },
  { symbol: 'AMZN', price: '184.74', change: '-0.14%' },
];

export function useMarketFeed(symbols: string[] | null = null, intervalMs = 5000) {
  const [watchlistData, setWatchlistData] = useState<MarketDataItem[]>([]);
  const [overviewData, setOverviewData] = useState<OverviewDataItem[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!symbols || symbols.length === 0) {
      setWatchlistData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Separate crypto symbols and stock symbols
        const cryptoSymbols = symbols.filter(s => !staticStocks.find(stock => stock.symbol === s));
        const stockSymbols = symbols.filter(s => staticStocks.find(stock => stock.symbol === s));

        // Fetch live crypto prices from Binance
        let cryptoData: MarketDataItem[] = [];
        if (cryptoSymbols.length > 0) {
          const binanceSymbols = cryptoSymbols.map(s => s.toUpperCase() + 'USDT');
          const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(
              JSON.stringify(binanceSymbols)
            )}`
          );
          const data = await res.json();

          cryptoData = data.map((item: any) => ({
            symbol: item.symbol.replace('USDT', ''),
            price: parseFloat(item.lastPrice).toFixed(2),
            change: parseFloat(item.priceChangePercent).toFixed(2) + '%',
          }));
        }

        // Get static stock data
        const stockData = staticStocks.filter(s => stockSymbols.includes(s.symbol));

        // Combine crypto + stock
        const combined = [...cryptoData, ...stockData];

        setWatchlistData(combined);
      } catch (err) {
        console.error('Failed to fetch market data', err);
      } finally {
        setIsLoading(false);
        setLastRefresh(Date.now());
      }
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);

    return () => clearInterval(interval);
  }, [symbols, intervalMs]);

  return useMemo(
    () => ({
      watchlistData,
      overviewData,
      lastRefresh,
      isLoading,
    }),
    [watchlistData, overviewData, lastRefresh, isLoading]
  );
}
