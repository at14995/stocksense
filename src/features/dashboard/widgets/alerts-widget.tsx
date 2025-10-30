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

const mockAlerts = [
    { id: 1, condition: 'BTC above $65,000', status: 'Active' },
    { id: 2, condition: 'ETH below $2,900', status: 'Triggered' },
    { id: 3, condition: 'AAPL below $180', status: 'Resolved' },
];

function getStatusColor(status: string) {
    switch (status) {
        case 'Active': return 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20';
        case 'Triggered': return 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20';
        case 'Resolved': return 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/20';
        default: return 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/20';
    }
}

export function AlertsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          <span>Price Alerts</span>
        </CardTitle>
         <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">Manage Alerts</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
            {mockAlerts.map(alert => (
                <div key={alert.id} className="flex justify-between items-center text-sm">
                    <span>{alert.condition}</span>
                    <Badge variant="outline" className={getStatusColor(alert.status)}>
                        {alert.status}
                    </Badge>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
