'use client';

import { motion } from 'framer-motion';
import type { HeroStat } from '@/types/home';
import { Card } from '../../ui/Card';

export function StatCard({ icon: Icon, label, value }: HeroStat) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{value}</p>
      </Card>
    </motion.div>
  );
}
