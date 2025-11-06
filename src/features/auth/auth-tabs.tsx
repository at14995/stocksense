'use client';

import { useState } from 'react';
import { SignInForm } from '@/features/auth/sign-in-form';
import { SignUpForm } from '@/features/auth/sign-up-form';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';
import { VerifyEmailPanel } from '@/features/auth/verify-email-panel';
import { useUser } from '@/firebase';
import { AnimatePresence, motion } from 'framer-motion';

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

      <div className="flex bg-[#151826] border border-gray-700/60 rounded-full p-1">
        <button
          onClick={() => setMode('signin')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            mode === 'signin'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            mode === 'signup'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
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
