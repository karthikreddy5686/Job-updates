'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getStudentSession } from '@/lib/student-auth';
import LandingGate from '@/components/LandingGate';
import {
  ArrowLeft,
  Search,
  Filter,
  Briefcase,
  Building2,
  ShieldCheck,
  Banknote,
  Rocket,
  GraduationCap,
  Cpu,
  HardHat,
  Home,
  Bookmark,
  User,
  Layers,
  Sparkles,
  RefreshCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { useDailyJobs, type DailyCategoryKey } from '@/hooks/useDailyJobs';
import JobCard from '@/components/JobCard';
import type { DailyJob } from '@/types/jobs';

const categoryIcons: Record<string, React.ComponentType<any>> = {
  internships: Briefcase,
  mnc: Building2,
  government: ShieldCheck,
  banking: Banknote,
  startups: Rocket,
  'cat-mba': GraduationCap,
  core: Cpu,
  civil: HardHat,
};

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

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryParam = params.category as string;
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [workMode, setWorkMode] = useState<string>(initialType);
  const [selectedExp, setSelectedExp] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const internalKey = (categoryParam === 'startups' ? 'startup' : categoryParam) as DailyCategoryKey;
  const categoryData = categories.find((c) => c.apiCategory === internalKey);
  const Icon = categoryIcons[categoryParam] || Briefcase;

  const rawJobs = useMemo(() => {
    const fetched = jobsByCategory[internalKey] || [];
    if (internalKey === 'government' && fetched.length === 0) {
      return governmentFallbackJobs;
    }
    return fetched;
  }, [internalKey, jobsByCategory]);

  const filteredJobs = useMemo(() => {
    return rawJobs.filter((job) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchLoc = job.location.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchLoc) return false;
      }

      // Work mode filter
      if (workMode !== 'all') {
        const mode = workMode.toLowerCase();
        const loc = job.location.toLowerCase();
        const type = typeof job.jobType === 'string' ? job.jobType.toLowerCase() : '';
        if (mode === 'remote') {
          if (!loc.includes('remote') && !type.includes('remote')) return false;
        } else if (mode === 'onsite') {
          if (loc.includes('remote') || type.includes('remote')) return false;
        } else if (mode === 'internship') {
          if (!type.includes('intern') && !job.title.toLowerCase().includes('intern')) return false;
        }
      }

      return true;
    });
  }, [rawJobs, searchQuery, workMode]);

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

  const categoryTitle = categoryData?.title || 'Jobs';

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* 📱 Top Header Bar (Matching Screenshot 2) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/job-updates"
            className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </Link>

          {/* Search Pill Input matching Screenshot 2 */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Results For ${categoryTitle}, India`}
              className="w-full h-10 pl-9 pr-3 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={() => refreshAll()}
            className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 shrink-0"
            title="Refresh"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        {/* Results Count & Filter Pills (Screenshot 2) */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <p className="font-semibold text-slate-600 pl-1">
            {isLoading ? 'Updating...' : `${filteredJobs.length} results`}
          </p>
        </div>

        {/* Horizontal Filter Chips Bar */}
        <div className="mt-2 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`shrink-0 px-3 py-1.5 rounded-full border flex items-center gap-1.5 font-medium transition-colors ${
              workMode !== 'all' || searchQuery
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {[
            { label: 'All Jobs', mode: 'all' },
            { label: 'Remote', mode: 'remote' },
            { label: 'On-site', mode: 'onsite' },
            { label: 'Internship', mode: 'internship' },
          ].map((chip) => (
            <button
              key={chip.mode}
              onClick={() => setWorkMode(chip.mode)}
              className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                workMode === chip.mode
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3.5">
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
            <h3 className="text-base font-bold text-slate-800">No jobs match your current filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try switching your work mode to "All Jobs" or clear your search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setWorkMode('all');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* List of Small Compact Tabs (Exactly matching Screenshot 2) */
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} variant="compact" />
          ))
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 shadow-lg flex items-center justify-around lg:hidden">
        <Link
          href="/job-updates"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800 font-medium text-[10px] transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href={`/job-updates/${categoryParam}`}
          className="flex flex-col items-center gap-0.5 text-blue-600 font-bold text-[10px]"
        >
          <Briefcase className="w-5 h-5 stroke-[2.2]" />
          <span>Jobs</span>
        </Link>
        <Link
          href="/job-updates/tracker"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800 font-medium text-[10px] transition-colors"
        >
          <Layers className="w-5 h-5" />
          <span>Tracker</span>
        </Link>
        <Link
          href="/job-updates/saved"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800 font-medium text-[10px] transition-colors"
        >
          <Bookmark className="w-5 h-5" />
          <span>Saved</span>
        </Link>
        <Link
          href="/dashboard#profile"
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-800 font-medium text-[10px] transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>

      {toastMessage && (
        <div className="fixed bottom-16 right-4 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
          <p className="text-xs font-semibold text-slate-900">{toastMessage}</p>
        </div>
      )}
    </main>
  );
}
