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
      return; // Wait until the user state is resolved
    }

    if (user) {
      // If the user is logged in, but their email is not verified,
      // ensure they are on the verification screen.
      if (!user.emailVerified) {
        if (!verify) {
          router.replace('/auth?verify=true');
        }
        // If they are already on the verify screen, do nothing.
      } else {
        // If the user is fully authenticated and verified, redirect to dashboard.
        // This handles cases where a logged-in user revisits the /auth page.
        router.replace('/dashboard');
      }
    }
    // If there is no user, remain on the auth page to allow sign-in/sign-up.
  }, [user, isUserLoading, router, verify]);

  // Show a loader only while the user's auth state is being determined,
  // or if a redirect is actively being processed for an already-logged-in user.
  if (isUserLoading || (user && user.emailVerified)) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Render the authentication tabs (sign-in, sign-up, email verification)
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#0F111A]/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 p-8 text-white space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Access your <span className="text-primary">Stock Sense</span> account
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in or create an account to continue
              </p>
            </div>
            <AuthTabs />
        </div>
    </div>
  );
}


export default function AuthPage() {
  return (
    <Suspense fallback={<div className="container flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <AuthPageContent />
    </Suspense>
  )
}
