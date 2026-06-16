'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { TopCompaniesSection } from '@/app/components';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-primary-700 dark:text-primary-300">
              Discover teams hiring now
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Explore companies with premium hiring momentum.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
              Curated company spotlights and role summaries, designed to help talent find the most compelling opportunities across industries.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full rounded-[1.5rem] border border-transparent bg-transparent py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-primary-200 dark:text-white dark:focus:border-slate-700 dark:focus:bg-slate-950"
            />
          </div>
        </div>
      </section>

      <TopCompaniesSection />
    </div>
  );
}
