'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`rounded-3xl bg-slate-200/80 dark:bg-slate-700/80 ${className}`}
      initial={{ opacity: 0.8 }}
      animate={shouldReduceMotion ? { opacity: 0.8 } : { opacity: [0.8, 0.4, 0.8] }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.2, repeat: Infinity }}
    />
  );
}
