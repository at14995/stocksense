'use client';

import {
  FeatureGrid,
  ContactSection,
  FAQAccordion,
  LiveMarketTicker,
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
      <motion.div
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <section className="relative w-full flex items-center justify-center overflow-hidden bg-transparent py-20 md:py-32">
          <div className="relative z-10 w-full max-w-2xl px-4">
             <HeroAlertForm />
          </div>
        </section>
        <div className="px-4">
          <LiveMarketTicker />
        </div>
        <FeatureGrid />
        <ContactSection />
        <FAQAccordion />
      </motion.div>
    </AnimatePresence>
  );
}
