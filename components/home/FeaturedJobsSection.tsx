'use client';

import { Button } from '../ui/Button';
import { Briefcase } from 'lucide-react';
import { EmptyState, Skeleton } from '../ui';
import { SectionContainer } from '../layout/SectionContainer';
import { useLoadingState } from '../../hooks/useLoadingState';
import { featuredJobs, featuredJobsMetadata } from '../../lib/data/home';
import { FeaturedJobCard } from './cards/FeaturedJobCard';

export function FeaturedJobsSection() {
  const isLoading = useLoadingState();

  return (
    <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
      <SectionContainer>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {featuredJobsMetadata.header.eyebrow}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {featuredJobsMetadata.header.title}
            </p>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-400">
              {featuredJobsMetadata.description}
            </p>
          </div>

          <Button variant="secondary" size="md" className="w-full sm:w-auto">
            {featuredJobsMetadata.cta}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No featured roles yet"
            description="We are updating the job feed. Check back soon for new opportunities."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredJobs.map((job, index) => (
              <FeaturedJobCard key={job.title} job={job} index={index} />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}
