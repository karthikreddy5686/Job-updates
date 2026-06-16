'use client';

import { motion } from 'framer-motion';
import { Cloud, Cpu, Database, LayoutGrid, Megaphone, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from './Card';

interface CategoryCard {
  title: string;
  description: string;
  jobs: string;
  icon: typeof Sparkles;
  accent: string;
}

const categories: CategoryCard[] = [
  {
    title: 'Software Development',
    description: 'Build scalable products and modern apps for global teams.',
    jobs: '128 jobs',
    icon: LayoutGrid,
    accent: 'from-primary-500 to-secondary-500',
  },
  {
    title: 'AI & Machine Learning',
    description: 'Design intelligent systems and data-driven automation.',
    jobs: '82 jobs',
    icon: Cpu,
    accent: 'from-secondary-500 to-accent-500',
  },
  {
    title: 'UI/UX Design',
    description: 'Create seamless digital interfaces with beautiful motion.',
    jobs: '74 jobs',
    icon: Sparkles,
    accent: 'from-accent-500 to-primary-500',
  },
  {
    title: 'Marketing',
    description: 'Drive brand growth with strategy, content, and campaigns.',
    jobs: '56 jobs',
    icon: Megaphone,
    accent: 'from-secondary-600 to-secondary-400',
  },
  {
    title: 'Finance',
    description: 'Support startups and enterprises with strategic finance roles.',
    jobs: '62 jobs',
    icon: TrendingUp,
    accent: 'from-primary-600 to-primary-400',
  },
  {
    title: 'Cybersecurity',
    description: 'Secure modern infrastructure and protect high-value data.',
    jobs: '43 jobs',
    icon: ShieldCheck,
    accent: 'from-accent-600 to-secondary-600',
  },
  {
    title: 'Data Science',
    description: 'Analyze large datasets and turn insights into action.',
    jobs: '68 jobs',
    icon: Database,
    accent: 'from-primary-500 to-accent-500',
  },
  {
    title: 'Cloud Computing',
    description: 'Design resilient architecture for distributed systems.',
    jobs: '51 jobs',
    icon: Cloud,
    accent: 'from-secondary-500 to-primary-500',
  },
];

export function JobCategoriesSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="text-3xl font-bold uppercase tracking-wide text-slate-950 dark:text-white sm:text-4xl">
              Explore categories
            </p>
            <h2 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white sm:text-lg">
              Jobs organized by the skills that matter most.
            </h2>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-400">
              Discover dynamic roles across development, design, data, security, cloud, and growth teams.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
            8 categories curated for ambitious professionals
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Card hover className="h-full overflow-hidden p-6 bg-white/90 dark:bg-slate-950/95">
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${category.accent} text-white shadow-lg shadow-slate-900/10`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {category.jobs}
                    </span>
                  </div>
                  <div className="mt-6 space-y-3">
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                      {category.title}
                    </h3>
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <div className="mt-6 text-sm font-semibold text-primary-600 transition group-hover:text-primary-700 dark:text-primary-300 dark:group-hover:text-primary-200">
                    Explore roles →
                  </div>
                </Card>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
