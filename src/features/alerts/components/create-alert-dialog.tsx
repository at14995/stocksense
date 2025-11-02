'use client';
import {
  Dialog,
  DialogContent,
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Alert } from '../types';

export default function CreateAlertDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user } = useUser();
  const { toast } = useToast();
  
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

  const handleSubmit = async () => {
    if (!valid || !user) return;
    setIsLoading(true);
    setErr(null);
    try {
      await createAlert(user.uid, {
        symbol: symbol.trim(),
        exchange,
        condition,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol (e.g., AAPL, BTC)"
          />

          <Select value={exchange} onValueChange={setExchange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Exchange" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NASDAQ">NASDAQ</SelectItem>
              <SelectItem value="NYSE">NYSE</SelectItem>
              <SelectItem value="BINANCE">Binance</SelectItem>
              <SelectItem value="COINBASE">Coinbase</SelectItem>
              <SelectItem value="KRAKEN">Kraken</SelectItem>
            </SelectContent>
          </Select>

          <Select value={condition} onValueChange={(v: any) => setCondition(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
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
