'use client';

import { Skeleton } from '../ui/Skeleton';
import { SectionContainer } from '../layout/SectionContainer';

export function HeroLoadingState() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 dark:bg-slate-950 sm:py-24">
      <SectionContainer className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Badge skeleton */}
            <Skeleton className="h-8 w-48 rounded-full" />

            {/* Main content skeleton */}
            <div className="space-y-6 max-w-3xl">
              {/* Eyebrow */}
              <Skeleton className="h-4 w-32" />
              
              {/* Heading - 2 lines */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>

              {/* Description - 3 lines */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-12 w-40 rounded-2xl" />
              <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-28 rounded-3xl" />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/95">
            <div className="space-y-5">
              {/* Quick search header */}
              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-6 w-48" />
              </div>

              {/* Search input */}
              <Skeleton className="h-11 rounded-3xl" />

              {/* Highlights */}
              <div className="grid gap-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="rounded-3xl bg-primary-600/5 p-5 dark:bg-primary-500/10">
                <Skeleton className="h-4 w-40 mb-3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
