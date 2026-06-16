'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Briefcase, Building2, Banknote, ShieldCheck, GraduationCap, Rocket } from 'lucide-react';
import { useDailyJobs, type DailyCategoryKey } from '@/hooks/useDailyJobs';
import JobCard from '@/components/JobCard';
import { Button } from '@/app/components';
import type { DateRangeOption } from '@/types/jobs';
import { useNotifications } from '@/app/providers';

const categoryIcons: Record<DailyCategoryKey, React.ElementType> = {
  internships: Briefcase,
  mnc: Building2,
  government: ShieldCheck,
  banking: Banknote,
  startup: Rocket,
  'cat-mba': GraduationCap,
  core: Briefcase,
  civil: Building2,
};

interface CategoryPageClientProps {
  categoryKey: DailyCategoryKey;
  title: string;
  description: string;
}

export default function CategoryPageClient({
  categoryKey,
  title,
  description,
}: CategoryPageClientProps) {
  const Icon = categoryIcons[categoryKey];
  const {
    jobsByCategory,
    countsByCategory,
    lastUpdatedLabel,
    isLoading,
    filters,
    setFilters,
    refreshAll,
  } = useDailyJobs();
  const { unreadCount } = useNotifications();

  const jobs = jobsByCategory[categoryKey] || [];
  const newCount = countsByCategory[categoryKey] ?? 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      <div className="relative overflow-hidden min-h-screen">
        <div className="pointer-events-none absolute -left-24 -top-12 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1000px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          
          <Link href="/job-updates" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          {/* Header Section */}
          <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E9D5FF] to-[#EDE9FE] text-[#7C3AED] shadow-sm shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#EDE9FE] bg-[#F8F3FF] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                    {newCount} new
                  </span>
                  <p className="text-xs text-slate-500 hidden sm:block">{lastUpdatedLabel(categoryKey)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Filters (same as dashboard) */}
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="grid auto-cols-min grid-flow-col gap-3 overflow-x-auto pb-1 md:overflow-visible">


                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm">
                  Job Type
                  <select
                    aria-label="Select job type"
                    value={filters.jobType}
                    onChange={(event) => setFilters((prev) => ({ ...prev, jobType: event.target.value as typeof filters.jobType }))}
                    className="bg-transparent outline-none text-sm"
                  >
                    <option value="all">All</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="internship">Internship</option>
                    <option value="full-time">Full-time</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm">
                  Company
                  <input
                    aria-label="Company"
                    value={filters.company}
                    onChange={(event) => setFilters((prev) => ({ ...prev, company: event.target.value }))}
                    placeholder="Any company"
                    className="w-32 bg-transparent outline-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm">
                  Sort
                  <select
                    aria-label="Sort results"
                    value={filters.sortBy}
                    onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value as typeof filters.sortBy }))}
                    className="bg-transparent outline-none text-sm"
                  >
                    <option value="newest-first">Newest</option>
                    <option value="deadline-soon">Deadline</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm">
                  Salary
                  <input
                    aria-label="Salary min"
                    value={filters.salaryRange[0]}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        salaryRange: [Math.max(0, Number(event.target.value)), prev.salaryRange[1]],
                      }))
                    }
                    min={0}
                    placeholder="Min"
                    className="w-20 bg-transparent outline-none text-sm"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    aria-label="Salary max"
                    value={filters.salaryRange[1]}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        salaryRange: [prev.salaryRange[0], Math.max(prev.salaryRange[0], Number(event.target.value))],
                      }))
                    }
                    min={0}
                    placeholder="Max"
                    className="w-20 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm shrink-0">
                  {unreadCount} alerts
                </div>
                <Button size="sm" variant="secondary" onClick={refreshAll}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Job Feed */}
          <div className="space-y-5">
            {isLoading ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                Fetching {title.toLowerCase()}...
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                <p className="font-medium mb-2">No matching jobs found</p>
                <p className="text-sm">Try broadening your filters to see more opportunities.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
