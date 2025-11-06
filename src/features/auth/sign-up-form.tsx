'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormField } from './form-field';
import { signUpSchema } from './schemas';
import type { ZodIssue } from 'zod';
import { ensureUserProfile } from '@/lib/profile';
import Link from 'next/link';

type SignUpErrors = {
  displayName?: string;
  email?: string;
  password?: string;
  form?: string;
};

export function SignUpForm() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = signUpSchema.safeParse({ displayName, email, password });
    if (!validation.success) {
      const fieldErrors: SignUpErrors = {};
      validation.error.errors.forEach((err: ZodIssue) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignUpErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });
      await ensureUserProfile(firestore, user.uid, { displayName, email });
      await sendEmailVerification(user);

      toast({
        title: 'Account Created',
        description: 'A verification email has been sent. Please check your inbox.',
      });
      
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.';
          break;
        case 'auth/operation-not-allowed':
           errorMessage = 'Email/password sign-up is currently disabled.';
           break;
      }
      setErrors({ form: errorMessage });
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-4">
          <FormField
            id="displayName-signup"
            label="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            error={errors.displayName}
            placeholder="Your Name"
          />
          <FormField
            id="email-signup"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="m@example.com"
          />
          <FormField
            id="password-signup"
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
        
        <div className="pt-2">
          <Button 
            className="w-full"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
          </Button>
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </form>
  );
}
