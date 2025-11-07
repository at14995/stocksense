'use client';
import { useEffect, useState } from "react";

export type BinancePrice = {
  symbol: string;
  price: string;
  lastPrice?: string;
  priceChangePercent?: string;
};

export function useBinancePrices() {
  const [prices, setPrices] = useState<BinancePrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/binance/prices");
      if (!res.ok) {
        throw new Error('Failed to fetch prices');
      }
      const data = await res.json();
      setPrices(data);
    } catch (err) {
      console.error("Error fetching Binance prices:", err);
      setPrices([]); // Clear prices on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  return { prices, isLoading };
}
