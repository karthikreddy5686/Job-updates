'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';
import { SectionContainer } from '../layout/SectionContainer';

export function NewsletterLoadingState() {
  return (
    <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
      <SectionContainer>
        <motion.div
          className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 shadow-2xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              {/* Eyebrow */}
              <Skeleton className="h-4 w-24" />
              
              {/* Title */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3" />
              </div>

              {/* Description - 3 lines */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>

            {/* Form area */}
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm dark:bg-slate-950">
              <div className="space-y-4">
                {/* Label */}
                <Skeleton className="h-4 w-32" />
                
                {/* Email input */}
                <Skeleton className="h-11 rounded-3xl" />
                
                {/* Subscribe button */}
                <Skeleton className="h-12 w-full rounded-2xl" />
                
                {/* Disclaimer */}
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
