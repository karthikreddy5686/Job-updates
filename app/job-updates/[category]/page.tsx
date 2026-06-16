'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStudentSession } from '@/lib/student-auth';
import LandingGate from '@/components/LandingGate';
import { ArrowLeft, Briefcase, Building2, ShieldCheck, Banknote, Rocket, GraduationCap, Cpu, HardHat } from 'lucide-react';
import { useDailyJobs, type DailyCategoryKey } from '@/hooks/useDailyJobs';
import CategorySection from '@/components/CategorySection';
import LiveJobFeed from '@/components/LiveJobFeed';

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

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryParam = params.category as string;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [checking, setChecking] = useState(true);

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
    lastUpdatedLabel,
    isLoading,
    toastMessage,
    refreshAll,
  } = useDailyJobs();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-slate-500/30 border-t-slate-900 rounded-full animate-spin" />
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

  // Find the exact category from our definitions
  const internalKey = categoryParam === 'startups' ? 'startup' : categoryParam as DailyCategoryKey;
  const categoryData = categories.find(c => c.apiCategory === internalKey);
  const Icon = categoryIcons[categoryParam] || Briefcase;
  const jobs = categoryData ? (jobsByCategory[internalKey] || []) : [];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="relative overflow-hidden min-h-screen">
        <div className="relative mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <LiveJobFeed />
              </div>
            </aside>

            <section className="flex-1 min-w-0 space-y-6">
              <div className="block lg:hidden">
                <LiveJobFeed />
              </div>

              <div className="flex items-center gap-4">
                 <Link href="/job-updates" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-700 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Feed
                 </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                    Fetching latest {categoryData?.title || 'jobs'} from live sources…
                  </div>
                ) : (
                  categoryData ? (
                    <CategorySection
                      icon={Icon}
                      title={categoryData.title}
                      description={categoryData.description}
                      categoryKey={internalKey}
                      jobs={jobs}
                      newCount={countsByCategory[internalKey] ?? 0}
                      lastUpdatedLabel={lastUpdatedLabel(internalKey)}
                      isExpanded={true}
                      hideLoadMore={true}
                      onToggle={() => {}}
                      onRefresh={refreshAll}
                    />
                  ) : (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                      Category not found.
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {toastMessage ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-2xl">
          <p className="text-sm font-semibold text-slate-900">{toastMessage}</p>
        </div>
      ) : null}
    </main>
  );
}
