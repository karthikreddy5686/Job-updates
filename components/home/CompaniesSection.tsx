'use client';

import { useLoadingState } from '../../hooks/useLoadingState';
import { Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState, Skeleton } from '../ui';
import { SectionContainer } from '../layout/SectionContainer';
import { companies, companiesMetadata } from '@/lib/data/home';
import { CompanyCard } from './cards/CompanyCard';

export function CompaniesSection() {
  const isLoading = useLoadingState();

  return (
    <section className="bg-white py-16 dark:bg-slate-950 sm:py-20">
      <SectionContainer>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
              {companiesMetadata.header.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {companiesMetadata.header.title}
            </h2>
          </div>
          <Button variant="secondary" size="md" className="w-full sm:w-auto">
            {companiesMetadata.cta}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No companies to show"
            description="We are populating featured partners with the most active hiring organizations."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {companies.map((company, index) => (
              <CompanyCard key={company.name} company={company} index={index} />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}
