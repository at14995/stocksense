'use client';

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, AlertTriangle, Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type HeroSectionProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  note?: string;
};

export function HeroSection({
  className,
  eyebrow = 'Full-stack market intelligence',
  title = 'Stock Sense',
  subtitle = 'Turn complex market data into clear, actionable insights for smarter trading decisions.',
  primaryCta = { text: 'Launch Dashboard', href: '/dashboard' },
  secondaryCta = { text: 'Explore Marketplace', href: '/marketplace' },
  note = 'Live prices update every 30s. Alerts via email or in-app.',
}: HeroSectionProps) {
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const stagger = {
    show: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <section className={cn('relative', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16"
          initial="hidden"
          whileInView="show"
          variants={stagger}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex flex-col justify-center">
            <motion.p
              className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary"
              variants={fadeUp}
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl"
              variants={fadeUp}
            >
              {title}
            </motion.h1>
            <motion.p
              className="mt-6 max-w-lg text-lg text-muted-foreground"
              variants={fadeUp}
            >
              {subtitle}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              variants={fadeUp}
            >
              <Button asChild size="lg" aria-label={primaryCta.text}>
                <Link href={primaryCta.href}>
                  {primaryCta.text} <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" aria-label={secondaryCta.text}>
                <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
              </Button>
            </motion.div>
            <motion.p
              className="mt-4 text-xs text-muted-foreground"
              variants={fadeUp}
            >
              {note}
            </motion.p>
          </div>
          <motion.div
            className="relative flex items-center justify-center lg:h-full"
            variants={stagger}
          >
            <motion.div
              className="group relative"
              variants={fadeUp}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="p-3 shadow-lg transform-gpu transition-transform hover:-rotate-3">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm">BTCUSDT</span>
                    <span className="text-sm font-semibold text-green-500 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1"/> +1.8%
                    </span>
                </div>
              </Card>
            </motion.div>
            <motion.div
              className="group absolute top-1/4 -right-8"
              variants={fadeUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="p-3 shadow-xl transform-gpu transition-transform hover:rotate-6">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm">AAPL</span>
                    <span className="text-sm font-semibold text-red-500 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 rotate-180"/> -0.6%
                    </span>
                </div>
              </Card>
            </motion.div>
            <motion.div
              className="group absolute bottom-1/4 -left-8"
              variants={fadeUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="p-3 shadow-2xl bg-destructive text-destructive-foreground transform-gpu transition-transform hover:rotate-2">
                 <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4"/>
                    <span className="font-mono text-xs">Alert: ETH above $3,200</span>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
