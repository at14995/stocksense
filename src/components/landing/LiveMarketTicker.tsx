
'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useBinancePrices } from '@/hooks/useBinancePrices';
import AssetIcon from '../ui/AssetIcon';

const initialStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.23, change24h: 1.12 },
  { symbol: 'MSFT', name: 'Microsoft', price: 410.55, change24h: -0.21 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 950.12, change24h: 2.78 },
  { symbol: 'AMZN', name: 'Amazon', price: 185.00, change24h: 0.25 },
  { symbol: 'META', name: 'Meta', price: 470.89, change24h: -1.54 },
];

export function LiveMarketTicker() {
  const { prices: crypto, isLoading } = useBinancePrices();

  const mappedCrypto = crypto.map((c: any) => ({
    ...c,
    displaySymbol: c.symbol.replace('USDT', ''), // base symbol for icons and text
  }));
  
  const renderCryptoRow = (item: any) => (
    <motion.div 
      key={item.symbol} 
      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 w-1/3">
      <AssetIcon symbol={item.displaySymbol} size={24} />
      <span className="text-white font-medium">{item.displaySymbol}</span>
      </div>
      <div className="text-gray-300 w-1/3 text-right font-mono">${parseFloat(item.lastPrice).toFixed(2)}</div>
      <div className={cn("text-sm w-1/3 text-right font-mono", parseFloat(item.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400')}>
        {parseFloat(item.priceChangePercent).toFixed(2)}%
      </div>
    </motion.div>
  );

  const renderStockRow = (item: any) => (
     <motion.div 
      key={item.symbol} 
      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 w-1/3">
        <AssetIcon symbol={item.symbol} size={24} />
        <span className="text-white font-medium">{item.symbol}</span>
      </div>
      <div className="text-gray-300 w-1/3 text-right font-mono">${item.price.toFixed(2)}</div>
      <div className={cn("text-sm w-1/3 text-right font-mono", item.change24h >= 0 ? 'text-green-400' : 'text-red-400')}>
        {item.change24h.toFixed(2)}%
      </div>
    </motion.div>
  )
  
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
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Live Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 text-center md:text-left">Top Cryptos</h3>
            <div className="space-y-1">
              {isLoading ? Array(5).fill(0).map((_,i) => renderSkeleton(i)) : mappedCrypto.map(renderCryptoRow)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 text-center md:text-left">Top Stocks</h3>
            <div className="space-y-1">
               {initialStocks.map(renderStockRow)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
