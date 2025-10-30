'use client';

import {
  HeroSection,
  FeatureGrid,
  StatsRow,
  CTASection,
  FAQAccordion,
} from '@/components/landing';
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
        <HeroSection />
        <StatsRow />
        <FeatureGrid />
        <CTASection />
        <FAQAccordion />
      </motion.main>
    </AnimatePresence>
  );
}
