'use client';
import { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: string[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl bg-[#191C29]/80 border border-white/10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!allow.includes(role)) {
    return (
      <>
        {fallback || (
          <div className="p-4 rounded-xl bg-[#191C29]/80 border border-white/10 text-gray-400 text-sm text-center">
            <p className="mb-4">
              🔒 This feature is available for{' '}
              <span className="font-semibold text-white">
                {allow.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(' or ')}
              </span>{' '}
              members.
            </p>
            <Button asChild variant="link" size="sm">
                <Link href="/pricing">
                    Upgrade Your Plan
                </Link>
            </Button>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
