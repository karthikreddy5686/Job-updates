'use client';

import { LayoutGrid } from 'lucide-react';
import { EmptyState, Skeleton } from '../ui';
import { SectionContainer } from '../layout/SectionContainer';
import { useLoadingState } from '../../hooks/useLoadingState';
import { categories, categoriesMetadata } from '@/lib/data/home';
import { CategoryCard } from './cards/CategoryCard';

export function CategoriesSection() {
  const isLoading = useLoadingState();

  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
      <SectionContainer>
        <div className="mb-10 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
              {categoriesMetadata.header.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {categoriesMetadata.header.title}
            </h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-400 max-w-xl">
              {categoriesMetadata.description}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {categoriesMetadata.hint}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-3xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No categories available"
            description="We are curating the most relevant job categories for your career search."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.label} {...category} />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}
