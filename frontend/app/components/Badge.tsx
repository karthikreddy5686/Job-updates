'use client';

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300',
  secondary: 'bg-secondary-100 dark:bg-secondary-950 text-secondary-700 dark:text-secondary-300',
  accent: 'bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300',
  success: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
  error: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
};

export function Badge({ label, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
