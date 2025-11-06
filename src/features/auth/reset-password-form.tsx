'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormField } from './form-field';
import { Loader2 } from 'lucide-react';
import { emailSchema } from './schemas';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset',
        description: 'A reset link has been sent to your email.',
      });
    } catch (error) {
      // Per privacy best practice, we don't reveal if an email is registered or not.
      toast({
        title: 'Password Reset',
        description: 'If an account exists, a reset link has been sent.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignIn = () => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', 'signin');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <form onSubmit={handleReset}>
        <CardHeader className="p-0 mb-6 text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription className="pt-1">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <FormField
            id="email-reset"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="m@example.com"
          />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4 p-0 pt-6">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </Button>
          <Button variant="link" size="sm" type="button" onClick={switchToSignIn}>
            Back to Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
