'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FormField } from './form-field';
import { Loader2 } from 'lucide-react';
import { emailSchema } from './schemas';

export function ResetPasswordForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h2 className="text-xl font-semibold">Reset Password</h2>
            <p className="text-sm text-gray-400 pt-1">
                Enter your email to receive a password reset link.
            </p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <FormField
            id="email-reset"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="m@example.com"
          />
          <div className="flex flex-col items-stretch gap-4 pt-2">
            <Button className="w-full h-12" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <Button variant="link" size="sm" type="button" onClick={onSwitchToSignIn} className="text-primary">
              Back to Sign In
            </Button>
          </div>
        </form>
    </div>
  );
}
