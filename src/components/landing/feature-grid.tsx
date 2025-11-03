'use client';

import { motion } from 'framer-motion';
import {
  UserCircle,
  Eye,
  BellRing,
  AreaChart,
  Store,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
};

const defaultFeatures: Feature[] = [
  {
    icon: UserCircle,
    title: 'Authentication and Profiles',
    description: 'Secure sign-in and personalized user profiles.',
    href: '/auth',
  },
  {
    icon: Eye,
    title: 'Watchlists with Logos',
    description: 'Create and track custom watchlists for your favorite stocks.',
    href: '/dashboard',
  },
  {
    icon: BellRing,
    title: 'Price Alerts',
    description: 'Set real-time price alerts and never miss a market move.',
    href: '/dashboard',
  },
  {
    icon: AreaChart,
    title: 'Live Market Data',
    description: 'Access up-to-the-minute stock prices and market data.',
    href: '/dashboard',
  },
  {
    icon: Store,
    title: 'Analyst Marketplace',
    description: 'Connect with expert analysts and access premium insights.',
    href: '/marketplace',
  },
];

type FeatureGridProps = {
  className?: string;
  items?: Feature[];
};

export function FeatureGrid({
  className,
  items = defaultFeatures,
}: FeatureGridProps) {
  const stagger = {
    show: { transition: { staggerChildren: 0.05 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="font-headline text-3xl font-bold">
                Features Built for Modern Investors
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                Everything you need to stay ahead in the fast-paced world of stock
                trading.
            </p>
        </div>
        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{ scale: 1.01, y: -5 }}
              className="h-full"
            >
              <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg bg-[#0E0E12]/90 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                    <Link href={feature.href} className="text-sm font-semibold text-primary hover:underline flex items-center">
                        Open <ArrowRight className="ml-1 h-4 w-4"/>
                    </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
