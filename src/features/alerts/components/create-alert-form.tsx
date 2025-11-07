'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useUser } from '@/firebase';
import { createAlert } from '@/features/alerts/alert-service';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AuthTabs } from '@/features/auth/auth-tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Alert } from '@/features/alerts/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useCurrency } from '@/context/CurrencyContext';
import { Combobox } from '@/components/ui/combobox';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TrendingUp, Bitcoin, Mail, MessageSquare, Bell, BellRing } from 'lucide-react';


const dummyTrending = {
  stocks: ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'GOOGL', 'MSFT', 'META', 'AMD', 'NFLX', 'DIS'],
  crypto: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'DOGE/USDT', 'ADA/USDT', 'AVAX/USDT', 'LINK/USDT', 'DOT/USDT', 'MATIC/USDT'],
};

const stockExchanges = ['NASDAQ', 'NYSE', 'LSE'];
const cryptoExchanges = ['Binance', 'Coinbase', 'Kraken', 'MEXC', 'Bybit', 'Bitfinex'];

export default function CreateAlertForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const { symbol: currencySymbol } = useCurrency();
  const [assetType, setAssetType] = useState('stocks');
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('');
  const [condition, setCondition] = useState<Alert['condition'] | ''>('');
  const [target, setTarget] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notifyVia, setNotifyVia] = useState({ email: true, sms: false, app: true });

  const handleAssetTypeChange = (value: string) => {
    setAssetType(value);
    setSymbol('');
    setExchange(''); // Reset exchange on asset type change
  };

  const handleSubmit = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!symbol || !target || !exchange || !condition) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all alert details.',
      });
      return;
    }

    try {
      const getNotificationMethod = () => {
        if (notifyVia.app) return 'app';
        if (notifyVia.email) return 'email';
        if (notifyVia.sms) return 'sms';
        return 'app';
      };

      await createAlert(user.uid, {
        symbol: symbol.toUpperCase(),
        exchange: exchange,
        condition: condition,
        target: Number(target),
        notificationMethod: getNotificationMethod(),
      });
      
      toast({
        title: 'Alert Set!',
        description: `You'll be notified for ${symbol.toUpperCase()} based on your criteria.`,
      });
      setSymbol('');
      setTarget('');
      setExchange('');
      setCondition('');
      router.push('/alerts');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save the alert. Please try again.',
      });
    }
  };

  const conditionLabel = 
    condition?.includes('percent') ? '%' :
    condition?.includes('dollar') ? currencySymbol :
    currencySymbol;
    
  const trendingAssets = assetType === 'stocks' ? dummyTrending.stocks : dummyTrending.crypto;
  const exchangeOptions = assetType === 'stocks' ? stockExchanges : cryptoExchanges;

  const assetOptions = trendingAssets.map(asset => ({ value: asset, label: asset }));

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="w-full max-w-lg mx-auto rounded-2xl bg-card shadow-xl p-6 sm:p-8 text-foreground space-y-6 border border-border">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
                <Bell className="h-6 w-6" />
                <span>Never Miss a Price Move</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                Set advanced, real-time alerts for stocks and crypto.
              </p>
            </div>
            
            <div className="flex w-full rounded-lg overflow-hidden border border-border p-1 bg-muted">
              <button
                onClick={() => handleAssetTypeChange("stocks")}
                className={cn('flex-1 py-2 font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2',
                  assetType === "stocks"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <TrendingUp className="h-4 w-4" /> Stocks
              </button>
              <button
                onClick={() => handleAssetTypeChange("crypto")}
                className={cn('flex-1 py-2 font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2',
                  assetType === "crypto"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <Bitcoin className="h-4 w-4" /> Crypto
              </button>
            </div>
              
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Combobox
                  options={assetOptions}
                  value={symbol}
                  onValueChange={setSymbol}
                  placeholder="Select Trending Asset"
                  searchPlaceholder='Search assets...'
                />
                <Input
                  type="text"
                  placeholder="Or enter symbol..."
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>

              <Select value={exchange} onValueChange={setExchange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exchange" />
                </SelectTrigger>
                <SelectContent side="bottom">
                    {exchangeOptions.map((ex) => (
                    <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select value={condition} onValueChange={(v: Alert['condition']) => setCondition(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                      <SelectItem value="price_reach">Price reaches</SelectItem>
                      <SelectItem value="percent_up">Price rises by (%)</SelectItem>
                      <SelectItem value="percent_down">Price drops by (%)</SelectItem>
                      <SelectItem value="price_up_dollar">Price increases by ($)</SelectItem>
                      <SelectItem value="price_down_dollar">Price decreases by ($)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <span
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none"
                  >
                    {conditionLabel}
                  </span>

                  <Input
                    type="number"
                    placeholder="Value"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
              
            <div>
              <p className="text-muted-foreground text-sm mb-3 font-medium">Notify me via:</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <Label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                  <Checkbox 
                    id="email" 
                    checked={notifyVia.email} 
                    onCheckedChange={(c) => setNotifyVia(v => ({...v, email: !!c}))} 
                  />
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email
                </Label>
                <Label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                   <Checkbox 
                    id="sms" 
                    checked={notifyVia.sms} 
                    onCheckedChange={(c) => setNotifyVia(v => ({...v, sms: !!c}))}
                   />
                  <MessageSquare className="h-4 w-4 text-muted-foreground" /> SMS
                </Label>
                <Label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                   <Checkbox 
                    id="app" 
                    checked={notifyVia.app} 
                    onCheckedChange={(c) => setNotifyVia(v => ({...v, app: !!c}))}
                   />
                   <BellRing className="h-4 w-4 text-muted-foreground" /> App Alert
                </Label>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleSubmit}>
              Set Alert
            </Button>
          </div>
        </motion.div>

        <DialogContent className="max-w-md p-0 bg-transparent border-0">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Sign In or Create Account</DialogTitle>
              <DialogDescription>
                Sign in to your Stock Sense account or create a new one to continue.
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <AuthTabs />
        </DialogContent>
      </Dialog>
    </>
  );
}
