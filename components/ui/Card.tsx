'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated';
}

export function Card({ className, children, variant = 'default', ...props }: CardProps) {
  const variantStyle =
    variant === 'elevated'
      ? 'bg-slate-50 border border-slate-200 shadow-2xl shadow-slate-900/5 dark:bg-slate-950 dark:border-slate-800'
      : 'bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={cn('rounded-3xl p-6 transition-colors duration-300', variantStyle, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
