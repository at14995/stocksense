'use client';

import { useState } from 'react';
import {
  BellRing,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Bitcoin,
  Mail,
  Bell,
  Send,
  Smartphone,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useUser } from '@/firebase';
import { createAlert } from '@/features/alerts/alert-service';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { AuthTabs } from '@/features/auth/auth-tabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const dummyTrending = {
  stocks: ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'GOOGL', 'MSFT', 'META', 'AMD', 'NFLX', 'DIS'],
  crypto: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'DOGE/USDT', 'ADA/USDT', 'AVAX/USDT', 'LINK/USDT', 'DOT/USDT', 'MATIC/USDT'],
};

export function HeroAlertForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [assetType, setAssetType] = useState('stocks');
  const [symbol, setSymbol] = useState('');
  const [condition, setCondition] = useState('target_price');
  const [target, setTarget] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notifyVia, setNotifyVia] = useState({ email: false, sms: false, app: false });

  const handleSubmit = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!symbol || !target) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all alert details.',
      });
      return;
    }

    try {
      // The createAlert function would need to be updated to support the new alert structure
      // For now, we adapt to the existing `createAlert` function signature
      const alertCondition = condition.includes('decrease') || condition.includes('drop') ? 'below' : 'above';
      await createAlert(user.uid, symbol, alertCondition, Number(target));
      
      toast({
        title: 'Alert Set!',
        description: `You'll be notified for ${symbol.toUpperCase()} based on your criteria.`,
      });
      setSymbol('');
      setTarget('');
      setNotifyVia({email: false, sms: false, app: false})
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save the alert. Please try again.',
      });
    }
  };

  const conditionLabel = 
    condition.includes('percentage') ? '%' :
    condition.includes('amount') ? '$' :
    '$';
    
  const trendingAssets = assetType === 'stocks' ? dummyTrending.stocks : dummyTrending.crypto;

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="w-full max-w-2xl mx-auto bg-[#0E0E12] border-white/10 shadow-2xl shadow-black/40 rounded-xl transition-all hover:shadow-black/60">
            <CardHeader className="text-center p-8">
              <CardTitle className="flex items-center gap-3 text-2xl justify-center">
                <BellRing className="w-7 h-7 text-primary" />
                <span>Never Miss a Price Move</span>
              </CardTitle>
              <CardDescription>Set advanced, real-time alerts for stocks and crypto.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <Tabs
                value={assetType}
                onValueChange={(value) => { setAssetType(value); setSymbol(''); }}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select onValueChange={setSymbol} value={symbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trending Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {trendingAssets.map(asset => (
                      <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="text"
                  placeholder="Or enter symbol..."
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={condition} onValueChange={setCondition as any}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="target_price">Price reaches</SelectItem>
                     <SelectItem value="increase_percentage">Price rises by</SelectItem>
                     <SelectItem value="decrease_percentage">Price drops by</SelectItem>
                     <SelectItem value="increase_amount">Price increases by</SelectItem>
                     <SelectItem value="decrease_amount">Price decreases by</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Value"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="h-10 pl-7"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {conditionLabel}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Notify me via:</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" checked={notifyVia.email} onCheckedChange={(c) => setNotifyVia(v => ({...v, email: !!c}))} />
                    <Label htmlFor="email" className="font-normal flex items-center gap-1.5"><Mail className="w-4 h-4"/>Email</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox id="sms" checked={notifyVia.sms} onCheckedChange={(c) => setNotifyVia(v => ({...v, sms: !!c}))} />
                    <Label htmlFor="sms" className="font-normal flex items-center gap-1.5"><Smartphone className="w-4 h-4"/>SMS</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox id="app" checked={notifyVia.app} onCheckedChange={(c) => setNotifyVia(v => ({...v, app: !!c}))} />
                    <Label htmlFor="app" className="font-normal flex items-center gap-1.5"><Bell className="w-4 h-4"/>App Alert</Label>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleSubmit}>
                Set Alert
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <DialogContent className="max-w-md p-0 bg-transparent border-0">
          <AuthTabs />
        </DialogContent>
      </Dialog>
    </>
  );
}
