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
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useUser } from '@/firebase';
import { createAlert } from '@/features/alerts/alert-service';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthTabs } from '@/features/auth/auth-tabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function HeroAlertForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [assetType, setAssetType] = useState('stocks');
  const [symbol, setSymbol] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [target, setTarget] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
      await createAlert(user.uid, symbol, condition, Number(target));
      toast({
        title: 'Alert Set!',
        description: `You'll be notified when ${symbol.toUpperCase()} is ${condition} $${target}.`,
      });
      setSymbol('');
      setTarget('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save the alert. Please try again.',
      });
    }
  };

  return (
    <>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="bg-background/80 backdrop-blur-md border-white/10 shadow-2xl shadow-primary/10 transition-all hover:shadow-primary/20 hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl justify-center">
                <BellRing className="w-7 h-7 text-primary" />
                <span>Create a Real-Time Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Tabs
                value={assetType}
                onValueChange={setAssetType}
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

              <div className="flex items-center bg-input/50 border border-input rounded-md focus-within:ring-2 focus-within:ring-ring">
                <DollarSign className="w-5 h-5 mx-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={
                    assetType === 'stocks' ? 'e.g. AAPL' : 'e.g. BTC/USDT'
                  }
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select value={condition} onValueChange={setCondition as any}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Target Price"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-10"
                />
              </div>

              <Select defaultValue="browser">
                <SelectTrigger>
                  <SelectValue placeholder="Notify via..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="browser">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" /> Browser
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </div>
                  </SelectItem>
                  <SelectItem value="telegram" disabled>
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Telegram (soon)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

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
