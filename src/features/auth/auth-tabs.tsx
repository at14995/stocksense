'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SignInForm } from '@/features/auth/sign-in-form';
import { SignUpForm } from '@/features/auth/sign-up-form';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';
import { VerifyEmailPanel } from '@/features/auth/verify-email-panel';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';

export function AuthTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const verify = searchParams.get('verify');
  const tab = searchParams.get('tab') || 'signin';

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (verify && user && !user.emailVerified) {
    return <VerifyEmailPanel email={user.email} />;
  }

  return (
    <Tabs value={tab} onValueChange={onTabChange} className="w-full">
      <div className="flex justify-center bg-[#1A1C27] rounded-full p-1 border border-gray-800 w-full max-w-xs mx-auto">
        <button
          onClick={() => onTabChange('signin')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
            tab === 'signin'
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => onTabChange('signup')}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
            tab === 'signup'
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="mt-6">
        <TabsContent value="signin" className="m-0">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup" className="m-0">
          <SignUpForm />
        </TabsContent>
        <TabsContent value="reset" className="m-0">
          <ResetPasswordForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
