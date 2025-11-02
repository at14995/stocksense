'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useUser } from '@/firebase';
import { createAlert } from '../alert-service';
import { Loader2, TrendingUp, Bitcoin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Alert } from '../types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const stockExchanges = ['NASDAQ', 'NYSE', 'LSE'];
const cryptoExchanges = ['Binance', 'Coinbase', 'Kraken', 'MEXC', 'Bybit', 'Bitfinex'];

export default function CreateAlertDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [assetType, setAssetType] = useState('stocks');
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('');
  const [condition, setCondition] = useState<Alert['condition'] | ''>('');
  const [targetValue, setTargetValue] = useState('');
  const [notificationMethod, setNotificationMethod] = useState('');
  
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const valid =
    /^[A-Z0-9:._/-]{1,15}$/.test(symbol.trim()) &&
    exchange &&
    condition &&
    !isNaN(Number(targetValue)) &&
    Number(targetValue) > 0 &&
    notificationMethod;

  const resetForm = () => {
    setAssetType('stocks');
    setSymbol('');
    setExchange('');
    setCondition('');
    setTargetValue('');
    setNotificationMethod('');
    setErr(null);
    setIsLoading(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };
  
  const handleAssetTypeChange = (value: string) => {
    setAssetType(value);
    setExchange(''); // Reset exchange when asset type changes
  };

  const handleSubmit = async () => {
    if (!valid || !user) return;
    setIsLoading(true);
    setErr(null);
    try {
      await createAlert(user.uid, {
        symbol: symbol.trim(),
        exchange,
        condition: condition as Alert['condition'],
        target: Number(targetValue),
        notificationMethod
      });

      toast({
        title: 'Alert Created',
        description: `Your alert for ${symbol.trim().toUpperCase()} has been set.`,
      });
      handleOpenChange(false);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create alert.');
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeOptions = assetType === 'stocks' ? stockExchanges : cryptoExchanges;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
          <DialogDescription>
            Define the conditions for your price alert and how you want to be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Tabs
            value={assetType}
            onValueChange={handleAssetTypeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stocks">
                <TrendingUp className="w-4 h-4 mr-2" /> Stocks
              </TabsTrigger>
              <TabsTrigger value="crypto">
                <Bitcoin className="w-4 h-4 mr-2" /> Crypto
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol (e.g., AAPL, BTC/USDT)"
          />

          <Select value={exchange} onValueChange={setExchange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Exchange" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              {exchangeOptions.map((ex) => (
                <SelectItem key={ex} value={ex}>{ex}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={condition} onValueChange={(v: any) => setCondition(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              <SelectItem value="price_up_dollar">Price increases by ($)</SelectItem>
              <SelectItem value="price_down_dollar">Price decreases by ($)</SelectItem>
              <SelectItem value="price_reach">Price reaches ($)</SelectItem>
              <SelectItem value="percent_up">Price increases by (%)</SelectItem>
              <SelectItem value="percent_down">Price decreases by (%)</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="Enter target amount or percentage"
            type="number"
          />

          <Select value={notificationMethod} onValueChange={setNotificationMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Notification Method" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="app">App Alert</SelectItem>
            </SelectContent>
          </Select>

          {err && <p className="text-sm text-destructive">{err}</p>}
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!valid || isLoading} onClick={handleSubmit}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
