'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
import { Loader2 } from 'lucide-react';
import { FormField } from './form-field';
import { signInSchema } from './schemas';
import type { ZodIssue } from 'zod';

type SignInErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});
  
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: SignInErrors = {};
      validation.error.errors.forEach((err: ZodIssue) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignInErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast({
        title: 'Sign In Successful',
        description: `Welcome back, ${user.displayName || user.email}!`,
      });

      router.push('/dashboard');

    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
      }
      setErrors({ form: errorMessage });
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToReset = () => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', 'reset');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <form onSubmit={handleSignIn}>
        <CardContent className="space-y-4 p-0">
          <FormField
            id="email-signin"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="m@example.com"
          />
          <FormField
            id="password-signin"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
           {errors.form && (
            <p className="text-sm font-medium text-destructive">{errors.form}</p>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4 p-0 pt-6">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </Button>
          <Button variant="link" size="sm" type="button" onClick={switchToReset} className="text-muted-foreground">
            Forgot password?
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
