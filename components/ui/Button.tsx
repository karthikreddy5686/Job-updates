'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white shadow-sm shadow-primary-500/20 hover:bg-primary-500 focus-visible:ring-primary-300',
  secondary:
    'bg-slate-900 text-white shadow-sm shadow-slate-900/10 hover:bg-slate-800 focus-visible:ring-slate-300 dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-slate-100 dark:focus-visible:ring-slate-400',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-2xl px-3 text-sm',
  md: 'h-11 rounded-[1.25rem] px-4 text-base',
  lg: 'h-12 rounded-3xl px-5 text-base',
};

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-3xl border border-transparent px-4 py-2 font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
