'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchInput } from '../ui/SearchInput';
import { SectionContainer } from '../layout/SectionContainer';
import { StatCard } from './cards/StatCard';
import { heroContent } from '@/lib/data/home';
import { useLoadingState } from '../../hooks/useLoadingState';
import { HeroLoadingState } from './HeroLoadingState';

export function HeroSection() {
  const isLoading = useLoadingState();

  if (isLoading) {
    return <HeroLoadingState />;
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 dark:bg-slate-950 sm:py-24">
      <SectionContainer className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center rounded-full bg-slate-900/95 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10">
              <Sparkles className="mr-2 h-4 w-4 text-primary-300" />
              Fresh jobs added daily
            </div>

            <div className="space-y-6 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
                {heroContent.eyebrow}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                {heroContent.title}
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                {heroContent.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">{heroContent.primaryAction}</Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-slate-900 dark:text-white">
                {heroContent.secondaryAction}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {heroContent.stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/95"
          >
            <div className="space-y-5">
              <div className="rounded-3xl bg-slate-50 p-5 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Quick search</p>
                <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Jump into today's top opportunities.</p>
              </div>

              <SearchInput placeholder="Search roles, companies, or keywords" />

              <div className="grid gap-3">
                {heroContent.highlights.map((highlight) => (
                  <div key={highlight.title} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{highlight.title}</p>
                    <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{highlight.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl bg-primary-600/5 p-5 text-slate-900 dark:bg-primary-500/10 dark:text-white">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-primary-600 dark:text-primary-200">
                  <ArrowRight className="h-4 w-4" />
                  New listings every day
                </div>
                <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">
                  Handpicked remote, hybrid, and on-site roles for ambitious professionals.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
