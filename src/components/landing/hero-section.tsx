'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { ArrowRight } from 'lucide-react';
import DarkVeil from '../backgrounds/DarkVeil';

export function HeroSection() {
  const { user } = useUser();
  const primaryHref = user ? '/dashboard' : '/auth';

  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <DarkVeil
          hueShift={30}
          noiseIntensity={0.08}
          scanlineIntensity={0.2}
          speed={0.8}
          scanlineFrequency={2.0}
          warpAmount={0.2}
          resolutionScale={1}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 text-center px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Full-Stack Market Intelligence
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto text-lg">
          Turn complex market data into clear, actionable insights for smarter trading decisions.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button asChild size="lg">
                <Link href={primaryHref}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
                <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
