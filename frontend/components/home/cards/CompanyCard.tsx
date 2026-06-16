'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CompanyProfile } from '@/types/home';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface CompanyCardProps {
  company: CompanyProfile;
  index: number;
}

export function CompanyCard({ company, index }: CompanyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      viewport={{ once: true }}
    >
      <Card className="h-full p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-lg font-semibold text-slate-900 dark:bg-slate-900 dark:text-white">
            {company.name.slice(0, 2)}
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {company.openings}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">{company.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{company.type}</p>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>{company.location}</span>
          <Button variant="ghost" size="sm" className="px-3 py-2 text-slate-700 dark:text-slate-300">
            View <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.article>
  );
}
