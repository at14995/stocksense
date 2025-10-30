'use client';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/firebase';
import { useUserNotifications, markAsRead, Notification } from './notificationService';
import Link from 'next/link';

export default function NotificationBell() {
  const { user } = useUser();
  const notifications = useUserNotifications(user?.uid || null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleClick(n: Notification) {
    if (!n.read) {
      await markAsRead(n.id);
    }
  }

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
        className="w-80 max-h-96 overflow-y-auto"
        align="end"
      >
        <div className="p-2 font-semibold border-b">Notifications</div>
        {notifications.length === 0 && (
          <p className="text-sm text-muted-foreground px-2 py-4 text-center">
            No notifications
          </p>
        )}
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.href || '#'}
            passHref
            className={`block p-2 mb-1 rounded-lg cursor-pointer ${
              !n.read
                ? 'bg-primary/10'
                : 'hover:bg-accent'
            }`}
            onClick={() => handleClick(n)}
          >
            <p className="font-medium text-sm">{n.title}</p>
            <p className="text-xs text-muted-foreground">{n.body}</p>
          </Link>
        ))}
         {notifications.length > 0 && (
            <div className="p-2 border-t mt-1 text-center">
                <Link href="/notifications" className="text-sm text-primary hover:underline">
                    View All
                </Link>
            </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
