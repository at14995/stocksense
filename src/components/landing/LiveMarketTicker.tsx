'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy data with logos
const initialCrypto = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67123.00, change24h: 2.14, logoUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25668/svg/color/btc.svg' },
  { symbol: 'ETH', name: 'Ethereum', price: 3264.10, change24h: -1.33, logoUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25668/svg/color/eth.svg' },
  { symbol: 'SOL', name: 'Solana', price: 150.75, change24h: 5.50, logoUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25668/svg/color/sol.svg' },
  { symbol: 'XRP', name: 'XRP', price: 0.52, change24h: 0.89, logoUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25668/svg/color/xrp.svg' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.16, change24h: 3.21, logoUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25668/svg/color/doge.svg' },
];

const initialStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.23, change24h: 1.12, logoUrl: 'https://companiesmarketcap.com/img/company-logos/64/AAPL.png' },
  { symbol: 'MSFT', name: 'Microsoft', price: 410.55, change24h: -0.21, logoUrl: 'https://companiesmarketcap.com/img/company-logos/64/MSFT.png' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 950.12, change24h: 2.78, logoUrl: 'https://companiesmarketcap.com/img/company-logos/64/NVDA.png' },
  { symbol: 'AMZN', name: 'Amazon', price: 185.00, change24h: 0.25, logoUrl: 'https://companiesmarketcap.com/img/company-logos/64/AMZN.png' },
  { symbol: 'META', name: 'Meta', price: 470.89, change24h: -1.54, logoUrl: 'https://companiesmarketcap.com/img/company-logos/64/META.png' },
];

type MarketDataItem = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  logoUrl: string;
};

// Custom hook to simulate live data
const useSimulatedMarketData = () => {
  const [crypto, setCrypto] = useState<MarketDataItem[]>([]);
  const [stocks, setStocks] = useState<MarketDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setTimeout(() => {
        setCrypto(initialCrypto);
        setStocks(initialStocks);
        setIsLoading(false);
    }, 1200)

    const updateData = (data: MarketDataItem[]) => {
      return data.map(item => {
        const changeFactor = (Math.random() - 0.5) * 0.01; // up to 0.5% change
        const newPrice = item.price * (1 + changeFactor);
        const newChangePercent = item.change24h + (changeFactor * (Math.random() * 5));
        return {
          ...item,
          price: newPrice,
          change24h: newChangePercent,
        };
      });
    };

    const intervalId = setInterval(() => {
      setCrypto(updateData);
      setStocks(updateData);
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return { crypto, stocks, isLoading };
};


export function LiveMarketTicker() {
  const { crypto, stocks, isLoading } = useSimulatedMarketData();

  const renderRow = (item: MarketDataItem) => (
    <motion.div 
      key={item.symbol} 
      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 w-1/3">
        <img src={item.logoUrl} alt={item.symbol} className="w-6 h-6 rounded-full bg-white/10 p-0.5" />
        <span className="text-white font-medium">{item.symbol}</span>
      </div>
      <div className="text-gray-300 w-1/3 text-right">${item.price.toFixed(2)}</div>
      <div className={cn("text-sm w-1/3 text-right", item.change24h >= 0 ? 'text-green-400' : 'text-red-400')}>
        {item.change24h.toFixed(2)}%
      </div>
    </motion.div>
  );
  
  const renderSkeleton = (key: number) => (
     <div key={key} className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center space-x-3 w-1/3">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
     </div>
  )

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto -mt-16 mb-16 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 border border-white/10">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Live Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 text-center md:text-left">Top Cryptos</h3>
            <div className="space-y-1">
              {isLoading ? Array(5).fill(0).map((_,i) => renderSkeleton(i)) : crypto.map(renderRow)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 text-center md:text-left">Top Stocks</h3>
            <div className="space-y-1">
               {isLoading ? Array(5).fill(0).map((_,i) => renderSkeleton(i)) : stocks.map(renderRow)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
