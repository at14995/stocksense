'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-4">
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
            placeholder="••••••••"
          />
           {errors.form && (
            <p className="text-sm font-medium text-destructive">{errors.form}</p>
          )}
        </div>
        
        <div>
          <Button 
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition shadow-lg shadow-indigo-800/30" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </Button>
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>
              Forgot password?{" "}
              <button type="button" onClick={switchToReset} className="text-indigo-400 hover:text-indigo-300">
                Reset here
              </button>
            </p>
          </div>
        </div>
      </form>
  );
}
