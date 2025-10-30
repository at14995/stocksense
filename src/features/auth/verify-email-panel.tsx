'use client';

import { useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type VerifyEmailPanelProps = {
  email: string | null;
};

export function VerifyEmailPanel({ email }: VerifyEmailPanelProps) {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0 || !user) return;
    setIsResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification Email Sent',
        description: 'A new verification link has been sent to your email.',
      });
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    setIsChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        toast({
          title: 'Email Verified!',
          description: 'Redirecting to your dashboard...',
        });
        router.push('/dashboard');
      } else {
        toast({
          title: 'Not Yet Verified',
          description: 'Please check your inbox and click the verification link.',
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not check verification status. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/auth');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          A verification link has been sent to <strong>{email}</strong>. Please check your
          inbox (and spam folder) to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={handleCheckVerification} disabled={isChecking}>
          {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          I've Verified My Email
        </Button>
        <Button onClick={handleResend} variant="secondary" disabled={isResending || cooldown > 0}>
          {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Resend Link {cooldown > 0 ? `(${cooldown}s)` : ''}
        </Button>
        <Button onClick={handleSignOut} variant="link" size="sm" className="text-muted-foreground">
          Sign in with a different account
        </Button>
      </CardContent>
    </Card>
  );
}
