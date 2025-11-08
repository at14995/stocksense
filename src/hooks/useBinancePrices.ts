'use client';
import { useEffect, useState } from 'react';

export function useBinancePrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This ensures the fetch runs only in the browser (client)
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        if (!res.ok) throw new Error('Failed to fetch Binance prices');

        const data = await res.json();

        // Optional: filter only major coins for performance
        const filtered = data.filter((item: any) =>
          ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT'].includes(item.symbol)
        );

        setPrices(filtered);
      } catch (err) {
        console.error('Binance fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();

    // Optional: refresh every 5 seconds
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  return { prices, isLoading };
}
