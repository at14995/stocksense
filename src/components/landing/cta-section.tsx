'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useUser } from '@/firebase';

type CTASectionProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  primary?: { text: string; href: string };
  secondary?: { text: string; href: string };
  reassurance?: string;
};

export function CTASection({
  className,
  title = 'Trade on signals, not noise.',
  subtitle = 'Build watchlists, set alerts, and analyze news in one place.',
  primary = { text: 'Get Started', href: '/auth' },
  secondary = { text: 'View Sentiment', href: '/sentiment' },
  reassurance = 'No credit card required.',
}: CTASectionProps) {
  const { user } = useUser();
  const primaryHref = user ? '/dashboard' : primary.href;
  const primaryText = user ? 'Go to Dashboard' : primary.text;
  
  return (
    <section
      className={cn(
        'relative overflow-hidden py-16 md:py-24 border-y',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 dark:from-primary/5 dark:to-accent/5"></div>
      <div className="container relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" aria-label={primaryText}>
              <Link href={primaryHref}>
                {primaryText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" aria-label={secondary.text}>
              <Link href={secondary.href}>{secondary.text}</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{reassurance}</p>
        </motion.div>
      </div>
    </section>
  );
}
