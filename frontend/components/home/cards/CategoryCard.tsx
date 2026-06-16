'use client';

import { motion } from 'framer-motion';
import type { CategoryItem } from '../../../types/home';
import { Card } from '../../ui/Card';

export function CategoryCard({ label, accent, icon: Icon }: CategoryItem) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full overflow-hidden p-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${accent} text-white`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Trusted by growing teams</p>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
