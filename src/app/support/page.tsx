
'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import UserSupportPage from '@/features/support/components/UserSupportPage';

export default function SupportPage() {
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
    <main className="flex justify-center items-start min-h-screen px-4 py-20 bg-transparent">
      <div className="max-w-5xl w-full bg-[#0E0E12]/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/10">
        <UserSupportPage />
      </div>
    </main>
  );
}
