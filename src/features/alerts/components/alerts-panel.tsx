'use client';
import { useEffect, useState } from 'react';
import { Bell, Plus, Trash2, Archive, Edit } from 'lucide-react';
import { useUser } from '@/firebase';
import {
  listenUserAlerts,
  updateAlertStatus,
  deleteAlert,
  updateAlert,
} from '../alert-service';
import CreateAlertDialog from './create-alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Alert } from '../types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/context/CurrencyContext';

export default function AlertsPanel() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const { symbol: currencySymbol } = useCurrency();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    };
    setIsLoading(true);
    const unsub = listenUserAlerts(user.uid, (data) => {
      setAlerts(data);
      setIsLoading(false);
    });
    return () => unsub && unsub();
  }, [user]);

  if (!user) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-500/20';
      case 'triggered':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-500/20';
      case 'archived':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-500/20';
      default:
        return 'bg-gray-100';
    }
  };

  const getConditionLabel = (alert: Alert) => {
    switch (alert.condition) {
      case 'price_up_dollar': return `Rises by ${currencySymbol}${alert.target}`;
      case 'price_down_dollar': return `Drops by ${currencySymbol}${alert.target}`;
      case 'price_reach': return `Reaches ${currencySymbol}${alert.target}`;
      case 'percent_up': return `Rises by ${alert.target}%`;
      case 'percent_down': return `Drops by ${alert.target}%`;
      default: return `Reaches ${alert.target}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            My Alerts
          </CardTitle>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Alert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Notify Via</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length > 0 ? (
                alerts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.symbol}</TableCell>
                    <TableCell>{a.exchange || 'N/A'}</TableCell>
                    <TableCell>{getConditionLabel(a)}</TableCell>
                    <TableCell className="capitalize">{a.notificationMethod}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${getStatusColor(a.status)}`}>
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingAlert(a)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Alert</TooltipContent>
                        </Tooltip>
                        {a.status === 'triggered' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateAlertStatus(a.id, 'archived')}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archive</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAlert(a.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No alerts yet. Create one to start monitoring prices.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CreateAlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {editingAlert && (
        <EditAlertDialog
          alert={editingAlert}
          open={!!editingAlert}
          onOpenChange={(isOpen) => !isOpen && setEditingAlert(null)}
        />
      )}
    </Card>
  );
}

function EditAlertDialog({
  alert,
  open,
  onOpenChange,
}: {
  alert: Alert;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [targetValue, setTargetValue] = useState(alert.target.toString());
  const [notificationMethod, setNotificationMethod] = useState(alert.notificationMethod);
  const [exchange, setExchange] = useState(alert.exchange || '');
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const valid = !isNaN(Number(targetValue)) && Number(targetValue) > 0 && notificationMethod && exchange;

  const handleUpdate = async () => {
    if (!valid) {
      setErr('Please fill out all fields correctly.');
      return;
    }
    setIsLoading(true);
    setErr(null);
    try {
      await updateAlert(alert.id, {
        target: Number(targetValue),
        notificationMethod,
        exchange,
      });
      toast({
        title: 'Alert Updated',
        description: `Your alert for ${alert.symbol} has been updated.`,
      });
      onOpenChange(false);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to update alert.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Alert for {alert.symbol}</DialogTitle>
          <DialogDescription>
            Modify the target value, exchange, or notification method for this alert.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="New Target Value"
            type="number"
          />

          <Select value={exchange} onValueChange={setExchange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Exchange" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false}>
              <SelectItem value="NASDAQ">NASDAQ</SelectItem>
              <SelectItem value="NYSE">NYSE</SelectItem>
              <SelectItem value="LSE">LSE</SelectItem>
              <SelectItem value="Binance">Binance</SelectItem>
              <SelectItem value="Coinbase">Coinbase</SelectItem>
              <SelectItem value="Kraken">Kraken</SelectItem>
              <SelectItem value="MEXC">MEXC</SelectItem>
              <SelectItem value="Bybit">Bybit</SelectItem>
              <SelectItem value="Bitfinex">Bitfinex</SelectItem>
            </SelectContent>
          </Select>

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
          <Button disabled={!valid || isLoading} onClick={handleUpdate}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
