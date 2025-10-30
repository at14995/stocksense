'use client';
import { useUser } from '@/firebase';
import { useUserNotifications, markAsRead } from './notificationService';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user } = useUser();
  const notifications = useUserNotifications(user?.uid || null);
  if (!user) return null;

  return (
    <motion.div
      className="container mx-auto max-w-3xl p-4 md:p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`${
              !n.read ? 'bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium">{n.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {n.body}
                  </p>
                  {n.href && (
                    <Button asChild variant="link" className="p-0 h-auto mt-2">
                      <Link href={n.href}>
                        View Details
                      </Link>
                    </Button>
                  )}
                </div>
                {!n.read && (
                  <Button
                    onClick={() => markAsRead(n.id)}
                    size="sm"
                    variant="outline"
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {notifications.length === 0 && (
        <p className="text-muted-foreground text-center mt-12">
          You have no notifications yet.
        </p>
      )}
    </motion.div>
  );
}
