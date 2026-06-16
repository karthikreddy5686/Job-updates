'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { TestimonialItem } from '../../../types/home';
import { Card } from '../../ui/Card';

export function TestimonialCard({ quote, name, role, company, rating }: TestimonialItem) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-500 text-white">
            {name.slice(0, 2)}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-950 dark:text-white">{name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{role}, {company}</p>
          </div>
        </div>
        <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-400">“{quote}”</p>
        <div className="mt-6 flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star
              key={starIndex}
              className={starIndex < rating ? 'h-4 w-4' : 'h-4 w-4 text-slate-300 dark:text-slate-700'}
            />
          ))}
        </div>
      </Card>
    </motion.article>
  );
}
