'use client';

import {
  FeatureGrid,
  StatsRow,
  CTASection,
  FAQAccordion,
} from '@/components/landing';
import { HeroAlertForm } from '@/components/landing/hero-alert-form';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function Home() {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-transparent">
          <div className="relative z-10 w-full max-w-2xl px-4">
             <HeroAlertForm />
          </div>
        </section>
        <StatsRow />
        <FeatureGrid />
        <CTASection />
        <FAQAccordion />
      </motion.main>
    </AnimatePresence>
  );
}
