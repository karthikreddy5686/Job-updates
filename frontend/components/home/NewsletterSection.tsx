'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { SectionContainer } from '../layout/SectionContainer';
import { newsletterContent } from '../../lib/data/home';
import { useLoadingState } from '../../hooks/useLoadingState';
import { NewsletterLoadingState } from './NewsletterLoadingState';

export function NewsletterSection() {
  const isLoading = useLoadingState();

  // Demo empty state (can be controlled by actual data availability)
  const isEmpty = false;

  if (isLoading) {
    return <NewsletterLoadingState />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={Mail}
        title="Newsletter temporarily unavailable"
        description="We're working on bringing our newsletter back online. Try again in a moment."
        action={<Button size="md">Try again</Button>}
      />
    );
  }

  return (
    <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 shadow-2xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
                {newsletterContent.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
                {newsletterContent.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
                {newsletterContent.description}
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm dark:bg-slate-950">
              <div className="space-y-4">
                <label htmlFor="email" className="text-sm font-medium text-slate-900 dark:text-white">
                  Your email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={newsletterContent.placeholder}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-primary-400 dark:focus:ring-primary-500/20"
                />
                <Button size="lg" className="w-full">
                  {newsletterContent.action}
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {newsletterContent.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
