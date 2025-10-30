'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { ArrowRight } from 'lucide-react';

const cards = [
  { symbol: 'BTCUSDT', price: '62,150', change: '+1.8%', color: 'bg-green-600' },
  { symbol: 'ETHUSDT', price: '3,210', change: '+0.9%', color: 'bg-emerald-600' },
  { symbol: 'AAPL', price: '185.40', change: '-0.6%', color: 'bg-red-600' },
];

export function HeroSection({
  className,
}: {
  className?: string;
}) {
  const { user } = useUser();
  const primaryHref = user ? '/dashboard' : '/auth';

  return (
    <section className={cn('relative min-h-[calc(100vh-4rem)] overflow-hidden', className)}>
       <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] bg-[length:20px_20px]"></div>
      <div className="container mx-auto px-6 md:px-12 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Left Column (Text) */}
          <div className="text-center md:text-left">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Full-Stack Market Intelligence
              <br />
              for Smarter Trading
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Turn complex market data into clear, actionable insights for smarter trading decisions.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column (Infographic) */}
          <div className="relative flex justify-center md:justify-end h-72 md:h-96">
             <div className="relative w-64 h-full">
                {cards.map((card, i) => (
                <motion.div
                    key={card.symbol}
                    className={cn(
                        'absolute p-4 rounded-xl shadow-lg backdrop-blur bg-card/70 border w-40 text-center text-sm',
                        {
                            'top-0 right-8': i === 0,
                            'top-28 right-0': i === 1,
                            'top-52 right-12': i === 2,
                        }
                    )}
                    initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -5 : 5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: 'easeOut' }}
                    whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="font-mono text-xs">{card.symbol}</div>
                    <div className="font-bold text-lg my-1">{card.price}</div>
                    <div className={cn('text-xs font-semibold px-2 py-0.5 rounded-full inline-block text-white', card.color)}>
                    {card.change}
                    </div>
                </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
