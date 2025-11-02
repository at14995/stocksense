'use client';
import { useEffect, useState } from 'react';
import { Bell, Plus, Trash2, Archive } from 'lucide-react';
import { useUser } from '@/firebase';
import {
  listenUserAlerts,
  updateAlertStatus,
  deleteAlert,
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

export default function AlertsPanel() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = listenUserAlerts(user.uid, setAlerts);
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
      case 'price_up_dollar': return `Rises by $${alert.target}`;
      case 'price_down_dollar': return `Drops by $${alert.target}`;
      case 'price_reach': return `Reaches $${alert.target}`;
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
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Alert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Notify Via</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.symbol}</TableCell>
                <TableCell>{getConditionLabel(a)}</TableCell>
                <TableCell className="capitalize">{a.notificationMethod}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${getStatusColor(a.status)}`}>
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <TooltipProvider>
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
            ))}
          </TableBody>
        </Table>
        {alerts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No alerts yet. Create one to start monitoring prices.
          </div>
        )}
      </CardContent>

      <CreateAlertDialog open={open} onOpenChange={setOpen} />
    </Card>
  );
}
