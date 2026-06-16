'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-950 dark:to-secondary-950 rounded-2xl flex items-center justify-center">
          <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary-600 dark:text-primary-400" />
        </div>
      </motion.div>

      <h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
        {description}
      </p>

      {action && <motion.div whileHover={{ scale: 1.05 }}>{action}</motion.div>}
    </motion.div>
  );
}
