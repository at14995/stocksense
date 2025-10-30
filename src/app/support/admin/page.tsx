'use client';
import AdminSupportPage from '@/features/support/components/AdminSupportPage';
import { useIsAdmin } from '@/features/support/hooks/useIsAdmin';
import { Loader2 } from 'lucide-react';

export default function SupportAdmin() {
  const isAdmin = useIsAdmin();

  if (isAdmin === null) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <AdminSupportPage />;
}
