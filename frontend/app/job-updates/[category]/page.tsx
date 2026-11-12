'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getStudentSession } from '@/lib/student-auth';
import LandingGate from '@/components/LandingGate';
import {
  Search,
  Bell,
  RefreshCcw,
  Briefcase,
  Building2,
  ShieldCheck,
  Banknote,
  Rocket,
  GraduationCap,
  Cpu,
  HardHat,
  X,
} from 'lucide-react';
import { useDailyJobs, type DailyCategoryKey } from '@/hooks/useDailyJobs';
import JobCard from '@/components/JobCard';
import MobileBottomNav from '@/components/job-updates/MobileBottomNav';
import JobDetailDrawer from '@/components/job-updates/JobDetailDrawer';
import JobFilterBar, {
  JobFilterState,
  initialFilterState,
  applyJobFilters,
} from '@/components/job-updates/JobFilterBar';
import { DownloadAppButton } from '@/components/pwa/PwaInstallPrompt';
import type { DailyJob } from '@/types/jobs';

const categoryTabs = [
  { id: 'mnc', label: 'MNC Jobs', href: '/job-updates/mnc' },
  { id: 'internships', label: 'Internships', href: '/job-updates/internships' },
  { id: 'startups', label: 'Startups', href: '/job-updates/startups' },
  { id: 'banking', label: 'Banking', href: '/job-updates/banking' },
  { id: 'government', label: 'Government', href: '/job-updates/government' },
  { id: 'core', label: 'Core Eng', href: '/job-updates/core' },
  { id: 'civil', label: 'Civil & Mech', href: '/job-updates/civil' },
  { id: 'cat-mba', label: 'CAT / MBA', href: '/job-updates/cat-mba' },
];

const governmentFallbackJobs: DailyJob[] = [
  {
    id: 'govt-upsc-2026',
    title: 'UPSC Civil Services Examination 2026',
    company: 'UPSC Official',
    location: 'New Delhi / Pan India',
    jobType: 'full-time',
    category: 'government',
    salary: '₹ 56,100 - 2,50,000 monthly',
    postedDate: new Date().toISOString(),
    deadline: 'June 15, 2026',
    applyLink: 'https://upsc.gov.in/examinations/active-examinations',
    isNew: true,
    source: 'UPSC',
  },
  {
    id: 'govt-ssc-cgl-2026',
    title: 'SSC CGL 2026 — Group B & C Recruitment',
    company: 'SSC Official',
    location: 'Pan India',
    jobType: 'full-time',
    category: 'government',
    salary: '₹ 25,500 - 1,51,100 monthly',
    postedDate: new Date().toISOString(),
    deadline: 'July 10, 2026',
    applyLink: 'https://ssc.gov.in/Portal/Notices',
    isNew: true,
    source: 'SSC',
  },
  {
    id: 'govt-rbi-grade-b-2026',
    title: 'RBI Grade B Officer Recruitment 2026',
    company: 'RBI Official',
    location: 'Pan India',
    jobType: 'full-time',
    category: 'government',
    salary: '₹ 55,200 - 1,16,684 monthly',
    postedDate: new Date().toISOString(),
    deadline: 'June 30, 2026',
    applyLink: 'https://opportunities.rbi.org.in/',
    isNew: true,
    source: 'RBI',
  },
];

function CategoryDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryParam = params.category as string;
  const initialQuery = searchParams.get('q') || '';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<JobFilterState>(initialFilterState);
  const [selectedJob, setSelectedJob] = useState<DailyJob | null>(null);

  useEffect(() => {
    if (categoryParam === 'referral') {
      router.replace('/job-updates/referral');
    }
  }, [categoryParam, router]);

  useEffect(() => {
    const session = getStudentSession();
    setStudent(session);
    setIsLoggedIn(!!session);
    setIsAdmin(localStorage.getItem('admin_session') === 'true');
    setChecking(false);
  }, []);

  const {
    categories,
    jobsByCategory,
    countsByCategory,
    isLoading,
    toastMessage,
    refreshAll,
  } = useDailyJobs();

  const internalKey = useMemo(() => {
    const p = (categoryParam || '').toLowerCase();
    if (p === 'startups' || p === 'startup') return 'startup';
    if (p === 'internships' || p === 'internship') return 'internships';
    if (p === 'cat' || p === 'cat-mba') return 'cat-mba';
    if (p === 'civil') return 'civil';
    if (p === 'core') return 'core';
    if (p === 'government') return 'government';
    if (p === 'banking') return 'banking';
    if (p === 'mnc') return 'mnc';
    return (p as DailyCategoryKey);
  }, [categoryParam]);

  const categoryData = categories.find((c) => c.apiCategory === internalKey);

  const categoryTitle = useMemo(() => {
    if (categoryData?.title) return categoryData.title;
    const titles: Record<string, string> = {
      mnc: 'Jobs in MNCs',
      internships: 'Internship Listings',
      government: 'Government Jobs',
      banking: 'Banking Jobs',
      startup: 'Startup Roles',
      core: 'Core Engineering Jobs',
      civil: 'Civil & Mechanical Jobs',
      'cat-mba': 'CAT / MBA Opportunities',
    };
    return titles[internalKey] || 'Jobs';
  }, [categoryData, internalKey]);

  const rawJobs = useMemo(() => {
    const fetched = jobsByCategory[internalKey] || [];
    if (internalKey === 'government' && fetched.length === 0) {
      return governmentFallbackJobs;
    }
    return fetched;
  }, [internalKey, jobsByCategory]);

  const filteredJobs = useMemo(() => {
    return applyJobFilters(rawJobs, filters, searchQuery);
  }, [rawJobs, filters, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn && !isAdmin) {
    return (
      <LandingGate
        onLogin={(s) => {
          setStudent(s);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* 📱 Top Header Bar (Identical to Explore Jobs by Category) */}
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
            <DownloadAppButton />
            <button
              onClick={() => refreshAll()}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
              title="Refresh"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <Link
              href="/job-updates/alerts"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Alerts"
            >
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Search Input identical to Explore jobs page */}
        <form onSubmit={handleSearchSubmit} className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'B.Tech / B.E.', roles, companies..."
              className="w-full h-11 pl-10 pr-9 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Section Switching Chips Bar */}
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          {categoryTabs.map((tab) => {
            const isActive =
              internalKey === tab.id ||
              (tab.id === 'startups' && internalKey === 'startup') ||
              (tab.id === 'cat-mba' && internalKey === 'cat-mba');
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Section Title and Count */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-1 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">{categoryTitle}</h1>
          <p className="text-xs text-slate-500">
            {isLoading ? 'Updating feed...' : `${filteredJobs.length} live openings available`}
          </p>
        </div>
      </div>

      {/* ⚡ Filter Bar (Naukri-style Quick Chips + Bottom Sheet) */}
      <div className="max-w-2xl mx-auto px-4 pt-1 pb-2">
        <JobFilterBar
          filters={filters}
          onChange={setFilters}
          totalResultsCount={filteredJobs.length}
        />
      </div>

      {/* Main Content Area: Compact Cards */}
      <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
        {isLoading ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">Fetching live openings for {categoryTitle}...</p>
            <p className="text-xs text-slate-400 mt-1">Directly verifying job requisitions</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-14 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No jobs match your query</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try clearing your search query or pick another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters(initialFilterState);
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-2xs"
            >
              Reset Filters & Search
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              variant="compact"
              onSelect={(j) => setSelectedJob(j)}
            />
          ))
        )}
      </div>

      {/* 📑 Split-Screen Master-Detail Job Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {toastMessage && (
        <div className="fixed bottom-16 right-4 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
          <p className="text-xs font-semibold text-slate-900">{toastMessage}</p>
        </div>
      )}
    </main>
  );
}

export default function CategoryDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <CategoryDetailPageContent />
    </React.Suspense>
  );
}
