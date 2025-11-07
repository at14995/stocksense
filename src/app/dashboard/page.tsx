'use client';

import { DashboardGrid } from '@/features/dashboard/dashboard-grid';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, BellPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
           <Button asChild>
              <Link href="/alerts/create">
                  <BellPlus className="h-4 w-4 mr-2" />
                  Add Alert
              </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/watchlists">Manage Watchlists</Link>
          </Button>
        </div>
      </div>
      <DashboardGrid />
    </div>
  );
}
