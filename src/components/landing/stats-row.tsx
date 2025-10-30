'use client';

import { motion, useInView, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { RefreshCcw, Gauge, Bell, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stat = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
};

const stats: Stat[] = [
  {
    icon: <RefreshCcw className="h-6 w-6 text-primary" />,
    value: 30,
    label: 'Live Refresh (sec)',
  },
  {
    icon: <Gauge className="h-6 w-6 text-primary" />,
    value: '−1→1',
    label: 'AI Sentiment',
  },
  {
    icon: <Bell className="h-6 w-6 text-primary" />,
    value: 'In-app',
    label: 'Email + Alerts',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    value: 'Verified',
    label: 'Analyst Marketplace',
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    return motionValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(0);
      }
    });
  }, [motionValue]);

  return <span ref={ref} />;
}

export function StatsRow({ className }: { className?: string }) {
  return (
    <section className={cn('py-12 bg-card border-y', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              {stat.icon}
              <div className="text-3xl font-bold tracking-tight">
                {typeof stat.value === 'number' ? (
                  <AnimatedNumber value={stat.value} />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
