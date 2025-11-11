'use client';

import { useEffect, useState, useMemo } from 'react';
import type { MarketDataItem, OverviewDataItem } from '../types';

const staticStocks: MarketDataItem[] = [
  { symbol: 'AAPL', price: '189.65', change: '0.22%' },
  { symbol: 'TSLA', price: '247.32', change: '-0.22%' },
  { symbol: 'GOOG', price: '143.39', change: '0.60%' },
  { symbol: 'AMZN', price: '184.74', change: '-0.14%' },
];

export function useMarketFeed(symbols: string[] | null = null, intervalMs = 5000) {
  const [watchlistData, setWatchlistData] = useState<MarketDataItem[]>([]);
  const [overviewData, setOverviewData] = useState<OverviewDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalize = (s: string) => s.trim().toUpperCase().replace(/USDT$/, '');

  useEffect(() => {
    if (!symbols || symbols.length === 0) {
      setWatchlistData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const normalizedSymbols = symbols.map(s => s.trim().toUpperCase());

        // Separate stocks vs crypto
        const stockSymbols = normalizedSymbols.filter(s =>
          staticStocks.some(stock => stock.symbol.toUpperCase() === s)
        );
        const cryptoSymbols = normalizedSymbols.filter(s =>
          !staticStocks.some(stock => stock.symbol.toUpperCase() === s)
        );

        // Stock data
        const stockData = staticStocks.filter(stock =>
          stockSymbols.includes(stock.symbol.toUpperCase())
        );

        // Crypto data
        let cryptoData: MarketDataItem[] = [];
        if (cryptoSymbols.length > 0) {
          const binanceSymbols = cryptoSymbols.map(s =>
            s.endsWith('USDT') ? s : s + 'USDT'
          );

          const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(
              JSON.stringify(binanceSymbols)
            )}`
          );

          const data = await res.json();

          cryptoData = data.map((item: any) => ({
            symbol: normalize(item.symbol), // strip USDT
            price: parseFloat(item.lastPrice).toFixed(2),
            change: parseFloat(item.priceChangePercent).toFixed(2) + '%',
          }));
        }

        setWatchlistData([...stockData, ...cryptoData]);
      } catch (err) {
        console.error('Failed to fetch market data', err);
        setWatchlistData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [symbols, intervalMs]);

  return useMemo(() => ({ watchlistData, overviewData, isLoading }), [watchlistData, overviewData, isLoading]);
}
