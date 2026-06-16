'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import type { FeaturedJob } from '../../../types/home';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface FeaturedJobCardProps {
  job: FeaturedJob;
  index: number;
}

export function FeaturedJobCard({ job, index }: FeaturedJobCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      viewport={{ once: true }}
    >
      <Card className="h-full p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{job.company}</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{job.title}</h3>
          </div>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-700 dark:bg-primary-900 dark:text-primary-200">
            {job.badge}
          </span>
        </div>

        <div className="mb-6 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4" />
          Hiring now
        </div>
        <div className="mt-8">
          <Button variant="ghost" size="sm">
            View role
          </Button>
        </div>
      </Card>
    </motion.article>
  );
}
