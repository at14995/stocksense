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
    <Tabs value={tab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-muted p-1 h-auto rounded-lg">
        <TabsTrigger value="signin" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md">Sign In</TabsTrigger>
        <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md">Create Account</TabsTrigger>
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
  );
}
