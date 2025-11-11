'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import CreateAlertForm from '@/features/alerts/components/create-alert-form';
import RoleGate from '@/components/auth/RoleGate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateAlertPage() {
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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <RoleGate
          allow={['trader', 'analyst']}
          fallback={
            <div className="text-center bg-card/80 p-8 rounded-2xl border border-border shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-2">Upgrade Required</h2>
                <p className="text-muted-foreground mb-6">Creating custom price alerts is a premium feature available for Trader and Analyst plan subscribers.</p>
                <Button asChild>
                    <Link href="/pricing">View Subscription Plans</Link>
                </Button>
            </div>
          }
        >
          <CreateAlertForm />
        </RoleGate>
      </div>
    </div>
  );
}
