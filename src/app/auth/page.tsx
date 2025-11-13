'use client';

import React, { Suspense, useEffect } from 'react';
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
      return; 
    }

    if (user) {
      if (!user.emailVerified) {
        if (!verify) {
          router.replace('/auth?verify=true');
        }
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, isUserLoading, router, verify]);

  if (isUserLoading || (user && user.emailVerified)) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent relative">
      <div className="w-full max-w-md backdrop-blur-xl bg-[#0E1019]/90 border border-gray-800/60 shadow-2xl rounded-2xl p-8 space-y-8 text-white">
        <AuthTabs />
      </div>
    </div>
  );
}


export default function AuthPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <Suspense fallback={<div className="container flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <AuthPageContent />
    </Suspense>
  )
}
