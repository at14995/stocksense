'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthTabs } from '@/features/auth/auth-tabs';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

function AuthPageContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isUserLoading) {
      // Don't do anything while the user state is loading.
      return;
    }

    if (user) {
      // User is logged in.
      if (user.emailVerified) {
        // If email is verified, redirect to the dashboard.
        router.push('/dashboard');
      } else if (!searchParams.has('verify')) {
        // If email is not verified, show the verification prompt.
        router.push('/auth?verify=true');
      }
    }
    // If there is no user and it's not loading, we stay on the auth page.
  }, [user, isUserLoading, router, searchParams]);

  // Show a loader while the auth state is being determined or if the user is logged in and a redirect is imminent.
  if (isUserLoading || user) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If no user is logged in and loading is complete, show the authentication forms.
  return (
    <>
      <div className="container relative flex min-h-[80vh] items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Access your Stock Sense account
            </h1>
          </div>
          <AuthTabs />
        </div>
      </div>
    </>
  );
}


export default function AuthPage() {
  return (
    <Suspense fallback={<div className="container flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <AuthPageContent />
    </Suspense>
  )
}
