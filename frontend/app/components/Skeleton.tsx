'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
  className?: string;
}

export function Skeleton({
  count = 1,
  height = 'h-4',
  width = 'w-full',
  circle = false,
  className = '',
}: SkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${width} ${height} ${circle ? 'rounded-full' : 'rounded-lg'} bg-gradient-to-r from-slate-200 dark:from-slate-800 via-slate-100 dark:via-slate-700 to-slate-200 dark:to-slate-800 ${className}`}
          animate={{
            backgroundPosition: ['200% 0%', '-200% 0%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </div>
  );
}
