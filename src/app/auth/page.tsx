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
  const verify = searchParams.get('verify');

  useEffect(() => {
    if (isUserLoading) {
      // While loading, do nothing. The loader will be displayed.
      return;
    }

    if (user) {
      // If a user object exists, we need to redirect.
      if (user.emailVerified) {
        // If the email is verified, go to the main dashboard.
        router.replace('/dashboard');
      } else if (!verify) {
        // If not verified and not already on the verify page, go there.
        router.replace('/auth?verify=true');
      }
    }
    // If no user, stay on the auth page to allow sign-in/sign-up.
  }, [user, isUserLoading, router, verify]);

  // Show a loader ONLY while the user state is initially loading.
  // Or if a redirect is imminent for an already logged-in user.
  if (isUserLoading || (user && (user.emailVerified || !verify))) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If there's no user and loading is finished, or if we need to show
  // the verification panel, render the main content.
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
