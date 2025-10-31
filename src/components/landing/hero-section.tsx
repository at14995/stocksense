'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { ArrowRight } from 'lucide-react';
import { HeroAlertForm } from './hero-alert-form';

export function HeroSection() {
  const { user } = useUser();
  const primaryHref = user ? '/dashboard' : '/auth';

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Foreground Content */}
      <div className="relative z-10 text-center px-6 md:px-12 lg:px-20">
        <HeroAlertForm />
      </div>
    </section>
  );
}
