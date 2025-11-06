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
          Access your <span className="text-primary">Stock Sense</span> account
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in or create an account to continue
        </p>
      </div>

      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Create Account</TabsTrigger>
        </TabsList>

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
    </>
  );
}
