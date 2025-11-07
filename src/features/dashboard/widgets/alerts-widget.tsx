'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { listenUserAlerts } from '@/features/alerts/alert-service';
import type { Alert } from '@/features/alerts/types';
import { Skeleton } from '@/components/ui/skeleton';

function getStatusColor(status: string) {
    switch (status) {
        case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
        case 'triggered': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
        case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
}

export function AlertsWidget() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[] | null>(null);

  useEffect(() => {
    if (!user) {
        setAlerts([]);
        return;
    }
    const unsub = listenUserAlerts(user.uid, (data) => {
        setAlerts(data);
    }, 3);
    return () => unsub && unsub();
  }, [user]);


  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            <span>Price Alerts</span>
          </CardTitle>
           <Button variant="outline" size="sm" asChild>
              <Link href="/alerts">Manage Alerts</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {alerts === null ? (
             <div className="space-y-3">
                <Skeleton className="h-6 w-full bg-[#191C29]" />
                <Skeleton className="h-6 w-full bg-[#191C29]" />
                <Skeleton className="h-6 w-full bg-[#191C29]" />
             </div>
          ) : alerts.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                  <p>No active alerts.</p>
                  <Button asChild variant="link">
                      <Link href="/alerts/create">Create one</Link>
                  </Button>
              </div>
          ) : (
              <div className="space-y-3">
                  {alerts.map(alert => (
                      <div key={alert.id} className="flex justify-between items-center text-sm">
                          <span className="font-mono">{alert.symbol} {alert.condition.includes('up') ? '>' : '<'} ${alert.target}</span>
                          <Badge variant="outline" className={getStatusColor(alert.status)}>
                              {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </Badge>
                      </div>
                  ))}
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
