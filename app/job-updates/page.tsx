'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudentSession } from '@/lib/student-auth';
import LandingGate from '@/components/LandingGate';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Home,
  User,
  Briefcase,
  Bookmark,
  Star,
  ChevronRight,
  ShieldCheck,
  Banknote,
  Rocket,
  GraduationCap,
  Building2,
  RefreshCcw,
  Users,
  Cpu,
  HardHat,
} from 'lucide-react';
import { Card, Button } from '@/app/components';
import { useAuth } from '@/lib/auth-context';
import { useJobUpdates } from '@/store/jobUpdatesStore';
import { useNotifications } from '@/app/providers';
import { useDailyJobs, type DailyCategoryKey } from '@/hooks/useDailyJobs';
import CategorySection from '@/components/CategorySection';
import JobUpdatesHero from '@/components/JobUpdatesHero';
import LiveJobFeed from '@/components/LiveJobFeed';
import MockInterviewWidget from '@/components/job-updates/MockInterviewWidget';
import BlogsWidget from '@/components/job-updates/BlogsWidget';
import type { DateRangeOption } from '@/types/jobs';

const navItems = [
  { id: 'dashboard', label: 'Dashboard Home', icon: Home, href: '/dashboard' },
  { id: 'profile', label: 'View Profile', icon: User, href: '/dashboard#profile' },
  { id: 'applications', label: 'Applications', icon: Briefcase, href: '/dashboard#applications' },
  { id: 'referral', label: 'Referral Hub', icon: Users, href: '/job-updates/referral' },
  { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark, href: '/job-updates/saved' },
];

const categoryIcons: Record<DailyCategoryKey, React.ComponentType<any>> = {
  internships: Briefcase,
  mnc: Building2,
  government: ShieldCheck,
  banking: Banknote,
  startup: Rocket,
  'cat-mba': GraduationCap,
  core: Cpu,
  civil: HardHat,
};

const initialExpanded: Record<DailyCategoryKey, boolean> = {
  internships: true,
  mnc: true,
  government: true,
  banking: true,
  startup: true,
  'cat-mba': true,
  core: true,
  civil: true,
};

export default function JobUpdatesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    setStudent(session);
    setIsLoggedIn(!!session);
    setIsAdmin(localStorage.getItem('admin_session') === 'true');
    setChecking(false);

    const onAuth = () => {
      const s = getStudentSession();
      setStudent(s);
      setIsLoggedIn(!!s);
    };
    const onAdminAuth = () => setIsAdmin(localStorage.getItem('admin_session') === 'true');

    window.addEventListener('studentLoggedIn', onAuth);
    window.addEventListener('studentLoggedOut', onAuth);
    window.addEventListener('storage', onAuth);
    window.addEventListener('adminLoggedIn', onAdminAuth);
    window.addEventListener('adminLoggedOut', onAdminAuth);

    return () => {
      window.removeEventListener('studentLoggedIn', onAuth);
      window.removeEventListener('studentLoggedOut', onAuth);
      window.removeEventListener('storage', onAuth);
      window.removeEventListener('adminLoggedIn', onAdminAuth);
      window.removeEventListener('adminLoggedOut', onAdminAuth);
    };
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(initialExpanded);
  const { savedRoles } = useJobUpdates();
  const { unreadCount, recentAlerts } = useNotifications();
  const {
    categories,
    jobsByCategory,
    countsByCategory,
    lastUpdatedLabel,
    lastFetch,
    isLoading,
    toastMessage,
    filters,
    setFilters,
    refreshAll,
    totalNewJobs,
  } = useDailyJobs();

  const totalJobs = useMemo(
    () =>
      categories.reduce((sum, category) => {
        const key = category.apiCategory as DailyCategoryKey;
        return sum + (jobsByCategory[key]?.length || 0);
      }, 0),
    [categories, jobsByCategory],
  );

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
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
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="relative overflow-hidden min-h-screen">
        <div className="pointer-events-none absolute -left-24 -top-12 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 w-full">
            <LiveJobFeed />
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 px-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Menu</p>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {[
                      { label: 'Main', href: '/job-updates', active: true },
                      { label: 'Application Tracker', href: '/job-updates/tracker' },
                      { label: 'Deadline Alerts', href: '/job-updates/alerts' },
                      { label: 'Referral Hub', href: '/job-updates/referral' },
                      { label: 'Saved Jobs', href: '/job-updates/saved' },
                      { label: 'Resume Match', href: '/resume-match' },
                    ].map(link => (
                      <Link key={link.href} href={link.href} prefetch={true} className={`px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${link.active ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
                <MockInterviewWidget />
                <BlogsWidget />
              </div>
            </aside>

            <section className="flex-1 min-w-0 space-y-8">

              <JobUpdatesHero
                totalNewJobs={totalNewJobs}
                lastFetch={lastFetch}
                onRefresh={refreshAll}
              />

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm max-h-[90px]">
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
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      {unreadCount} alerts
                    </div>
                    <Button size="sm" variant="secondary" onClick={refreshAll}>
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 job-category-grid">
                {isLoading ? (
                  <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    Fetching today’s jobs from live sources…
                  </div>
                ) : (
                  categories.map((category) => {
                    const key = category.apiCategory as DailyCategoryKey;
                    const jobs = jobsByCategory[key] || [];
                    const title = category.title;
                    const description = category.description;
                    const Icon = categoryIcons[key];

                    return (
                      <CategorySection
                        key={category.id}
                        icon={Icon}
                        title={title}
                        description={description}
                        categoryKey={key}
                        jobs={jobs}
                        newCount={countsByCategory[key] ?? 0}
                        lastUpdatedLabel={lastUpdatedLabel(key)}
                        isExpanded={expandedSections[key]}
                        onToggle={() => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))}
                        onRefresh={refreshAll}
                      />
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="absolute left-0 top-0 z-50 flex h-full w-80 flex-col overflow-hidden rounded-r-[2rem] border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/95 p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Menu</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-white">Navigation</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 transition hover:border-primary-500"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="mt-8 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        prefetch={true}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/5 px-4 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-350 transition-all duration-200 hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-950/80 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Icon className="h-4.5 w-4.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <div className="flex items-center gap-3 rounded-2xl border border-primary-500 bg-primary-500/10 dark:bg-primary-500/20 px-4 py-3.5 text-sm font-bold text-primary-600 dark:text-primary-400">
                    <Star className="h-4.5 w-4.5 fill-primary-500/20 text-primary-500" />
                    Job Updates Hub
                  </div>
                </nav>

                <div className="mt-auto rounded-2xl bg-slate-50 dark:bg-slate-950/90 p-4 border border-slate-100 dark:border-white/5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white shadow-md">
                    {student?.name
                      ? student.name
                          .split(' ')
                          .map((part: string) => part[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : isAdmin
                      ? 'AD'
                      : 'JK'}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
                      {student?.name ?? (isAdmin ? 'Admin' : 'Jordan Kim')}
                    </p>
                    <p className="text-xs font-bold text-slate-650 dark:text-slate-300">
                      {student ? 'Student' : isAdmin ? 'Administrator' : 'Product Designer'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {toastMessage ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toastMessage}</p>
        </div>
      ) : null}
    </main>
  );
}
