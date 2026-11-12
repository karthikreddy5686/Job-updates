'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Home,
  Briefcase,
  Building2,
  ShieldCheck,
  Banknote,
  Rocket,
  Cpu,
  GraduationCap,
  HardHat,
  TrendingUp,
  Bookmark,
  User,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';
import JobCard from '@/components/JobCard';
import MobileBottomNav from '@/components/job-updates/MobileBottomNav';
import type { DailyJob } from '@/types/jobs';
import type { DailyCategoryKey } from '@/hooks/useDailyJobs';

interface MobileJobHomeProps {
  student: any;
  categories: any[];
  jobsByCategory: Record<DailyCategoryKey, DailyJob[]>;
  countsByCategory: Record<DailyCategoryKey, number>;
  totalNewJobs: number;
  unreadCount: number;
  refreshAll: () => Promise<void>;
  isLoading: boolean;
}

export default function MobileJobHome({
  student,
  categories,
  jobsByCategory,
  countsByCategory,
  totalNewJobs,
  unreadCount,
  refreshAll,
  isLoading,
}: MobileJobHomeProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 4x2 Category Grid matching the 8 distinct job sections
  const categoryTiles = [
    {
      id: 'mnc',
      title: 'Jobs in\nMNCs',
      icon: Building2,
      bgColor: 'bg-[#FEF9E7]',
      textColor: 'text-[#CA8A04]',
      borderColor: 'border-[#FEF0B8]',
      href: '/job-updates/mnc',
    },
    {
      id: 'internships',
      title: 'Internships',
      icon: Briefcase,
      bgColor: 'bg-[#ECFDF5]',
      textColor: 'text-[#059669]',
      borderColor: 'border-[#D1F2E2]',
      href: '/job-updates/internships',
    },
    {
      id: 'startups',
      title: 'Startup\nJobs',
      icon: Rocket,
      bgColor: 'bg-[#F0EBFF]',
      textColor: 'text-[#7C3AED]',
      borderColor: 'border-[#E4D7FF]',
      href: '/job-updates/startups',
    },
    {
      id: 'banking',
      title: 'Banking\nJobs',
      icon: TrendingUp,
      bgColor: 'bg-[#FEF7E6]',
      textColor: 'text-[#D97706]',
      borderColor: 'border-[#FDE7BA]',
      href: '/job-updates/banking',
    },
    {
      id: 'government',
      title: 'Government\nJobs',
      icon: ShieldCheck,
      bgColor: 'bg-[#EEF2FF]',
      textColor: 'text-[#4F46E5]',
      borderColor: 'border-[#E0E7FF]',
      href: '/job-updates/government',
    },
    {
      id: 'core',
      title: 'Core\nEngineering',
      icon: Cpu,
      bgColor: 'bg-[#E6FFFA]',
      textColor: 'text-[#0D9488]',
      borderColor: 'border-[#CCFBF1]',
      href: '/job-updates/core',
    },
    {
      id: 'civil',
      title: 'Civil &\nMech Jobs',
      icon: HardHat,
      bgColor: 'bg-[#FFF1EC]',
      textColor: 'text-[#EA580C]',
      borderColor: 'border-[#FED9CB]',
      href: '/job-updates/civil',
    },
    {
      id: 'cat-mba',
      title: 'CAT / MBA\nJobs',
      icon: GraduationCap,
      bgColor: 'bg-[#FFF0F0]',
      textColor: 'text-[#E11D48]',
      borderColor: 'border-[#FFE0E0]',
      href: '/job-updates/cat-mba',
    },
  ];

  // Aggregate curated list of jobs for "Jobs based on your profile"
  const allJobs = useMemo(() => {
    const list: DailyJob[] = [];
    const priorityCategories: DailyCategoryKey[] = ['mnc', 'internships', 'startup', 'core', 'banking', 'government', 'civil', 'cat-mba'];
    priorityCategories.forEach(key => {
      const catJobs = jobsByCategory[key] || [];
      catJobs.forEach(job => {
        if (!list.some(existing => existing.id === job.id)) {
          list.push(job);
        }
      });
    });
    return list;
  }, [jobsByCategory]);

  const filteredJobs = useMemo(() => {
    let result = allJobs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allJobs, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/job-updates/mnc?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="block lg:hidden min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* 1. Header Bar: Welcome User + Notification Bell */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {(student?.name?.[0] || 'J').toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Welcome, {student?.name?.split(' ')[0] || 'Job Seeker'}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Explore live verified jobs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshAll()}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
              title="Refresh feed"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <Link
              href="/job-updates/alerts"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Link>
          </div>
        </div>

        {/* 2. Search Input (Clean without redundant pill navbar below) */}
        <form onSubmit={handleSearchSubmit} className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'B.Tech / B.E.', roles, companies..."
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>
        </form>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* 3. Section: Explore jobs by category */}
        <section>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Explore jobs by category
            </h2>
            <span className="text-xs font-semibold text-blue-600">8 Categories</span>
          </div>

          {/* 4 columns x 2 rows Grid matching all 8 sections */}
          <div className="grid grid-cols-4 gap-3">
            {categoryTiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.id}
                  href={tile.href}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${tile.bgColor} ${tile.textColor} border ${tile.borderColor} flex items-center justify-center shadow-2xs group-hover:scale-105 group-active:scale-95 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="mt-2 text-[11px] font-semibold text-slate-700 text-center leading-tight whitespace-pre-line line-clamp-2">
                    {tile.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Free AI Resume Match Banner (Clear that it's 100% Free, not paid) */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white shadow-sm">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-wide">Free AI Resume Match</span>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  100% Free
                </span>
              </div>
              <p className="mt-1 text-xs text-blue-100 font-medium leading-snug">
                Compare your resume with live job postings & get tailored interview tips
              </p>
            </div>
            <Link
              href="/resume-match"
              className="shrink-0 px-3.5 py-2 rounded-full bg-white text-indigo-700 font-bold text-xs shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Match Resume</span>
            </Link>
          </div>
        </section>

        {/* 5. Section: Jobs based on your profile */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Jobs based on your profile
              </h3>
              <p className="text-xs text-slate-500">
                {filteredJobs.length} live openings updated today
              </p>
            </div>
            <Link
              href="/job-updates/mnc"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* List of Compact Tab Cards */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 p-6">
                <div className="w-7 h-7 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading today's fresh jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-10 text-center bg-white rounded-2xl border border-slate-100 p-6">
                <p className="text-sm font-semibold text-slate-800">No jobs match your query</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting your search or pick another category.</p>
              </div>
            ) : (
              filteredJobs.slice(0, 15).map((job) => (
                <JobCard key={job.id} job={job} variant="compact" />
              ))
            )}
          </div>

          {filteredJobs.length > 15 && (
            <div className="pt-2 text-center">
              <Link
                href="/job-updates/mnc"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                View all {filteredJobs.length} jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* 6. Mobile Bottom Navigation Bar (Home, Jobs, Tracker, Saved, Profile) */}
      <MobileBottomNav />
    </div>
  );
}
