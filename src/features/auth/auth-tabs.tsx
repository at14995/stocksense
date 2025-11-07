'use client';

import { useState } from 'react';
import { SignInForm } from '@/features/auth/sign-in-form';
import { SignUpForm } from '@/features/auth/sign-up-form';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';
import { VerifyEmailPanel } from '@/features/auth/verify-email-panel';
import { useUser } from '@/firebase';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AuthTabs() {
  const { user } = useUser();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');

  if (user && !user.emailVerified) {
    return <VerifyEmailPanel email={user.email} />;
  }
  
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

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

      <div className="flex w-full rounded-full overflow-hidden border border-border p-1 bg-muted max-w-sm mx-auto">
        <button
          onClick={() => setMode('signin')}
          className={cn('flex-1 py-2 font-medium text-sm rounded-full transition-colors flex items-center justify-center gap-2',
            mode === "signin"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-accent/50"
          )}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={cn('flex-1 py-2 font-medium text-sm rounded-full transition-colors flex items-center justify-center gap-2',
            mode === "signup"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-accent/50"
          )}
        >
          Create Account
        </button>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={contentVariants}
                transition={{ duration: 0.2 }}
            >
                {mode === 'signin' && <SignInForm onSwitchToReset={() => setMode('reset')} />}
                {mode === 'signup' && <SignUpForm />}
                {mode === 'reset' && <ResetPasswordForm onSwitchToSignIn={() => setMode('signin')} />}
            </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
