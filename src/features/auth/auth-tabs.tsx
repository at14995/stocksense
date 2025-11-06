'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Access your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Stock Sense</span> account
        </h1>
        <p className="text-sm text-gray-400">
          Sign in or create an account to continue
        </p>
      </div>

      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#151826] border border-gray-700/60 rounded-full p-1">
          <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r from-indigo-500 to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full">Sign In</TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r from-indigo-500 to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full">Create Account</TabsTrigger>
        </TabsList>

        <div className="mt-8">
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
    </>
  );
}
