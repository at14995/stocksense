'use client';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listenUserAlerts } from '../alerts/alert-service';
import { Alert } from '../alerts/types';

function getConditionLabel(alert: Alert) {
  switch (alert.condition) {
    case 'price_up_dollar': return `rises by $${alert.target}`;
    case 'price_down_dollar': return `drops by $${alert.target}`;
    case 'price_reach': return `reaches $${alert.target}`;
    case 'percent_up': return `rises by ${alert.target}%`;
    case 'percent_down': return `drops by ${alert.target}%`;
    default: return `reaches ${alert.target}`;
  }
}


export default function NotificationBell() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // For now, we will treat any alert as "unread" for demonstration
  const unreadCount = alerts.length > 0 ? alerts.filter(a => a.status === 'active').length : 0;

  useEffect(() => {
    if (!user) {
        setAlerts([]);
        return;
    };
    // Listen to the 5 most recent alerts for the navbar
    const unsub = listenUserAlerts(user.uid, setAlerts, 5);
    return () => unsub && unsub();

  }, [user]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 max-h-96 overflow-y-auto data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
        align="end"
      >
        <div className="p-2 font-semibold border-b">Recent Alerts</div>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 py-4 text-center">
            No active alerts
          </p>
        ) : (
           alerts.map((alert) => (
              <Link
                key={alert.id}
                href={'/alerts'}
                passHref
                className={`block p-2 mb-1 rounded-lg cursor-pointer hover:bg-accent ${
                    alert.status === 'active' ? 'bg-primary/5' : ''
                }`}
              >
                <p className="font-medium text-sm">{alert.symbol}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {getConditionLabel(alert)}
                </p>
              </Link>
            ))
        )}
         
        <div className="p-2 border-t mt-1 text-center">
            <Link href="/alerts" className="text-sm text-primary hover:underline">
                View All Alerts
            </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
