'use client';

import { Star } from 'lucide-react';
import { EmptyState, Skeleton } from '../ui';
import { SectionContainer } from '../layout/SectionContainer';
import { useLoadingState } from '../../hooks/useLoadingState';
import { testimonials, testimonialsMetadata } from '@/lib/data/home';
import { TestimonialCard } from './cards/TestimonialCard';

export function TestimonialsSection() {
  const isLoading = useLoadingState();

  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
      <SectionContainer>
        <div className="mb-10 space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
            {testimonialsMetadata.header.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {testimonialsMetadata.header.title}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
            {testimonialsMetadata.header.description}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-3xl" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No testimonials yet"
            description="We are collecting feedback from candidates and employers."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((review) => (
              <TestimonialCard key={review.name} {...review} />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}
