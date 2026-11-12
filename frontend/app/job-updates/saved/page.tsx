'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/app/components';
import { getStudentSession } from '@/lib/student-auth';
import { User, Loader2, ArrowLeft, Bookmark } from 'lucide-react';
import MobileBottomNav from '@/components/job-updates/MobileBottomNav';

interface SavedJobRecord {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  savedDate: string;
  deadline?: string;
  applyLink: string;
  salary?: string;
  source: string;
}

export default function SavedJobsPage() {
  const [student, setStudent] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStudent(getStudentSession());
    setIsAdmin(localStorage.getItem('admin_session') === 'true');
    setIsReady(true);

    const onAuth = () => setStudent(getStudentSession());
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

  const effectiveUserId = student?.id || student?.email || (isAdmin ? 'admin' : 'guest_user');

  useEffect(() => {
    if (!isReady) return;

    let active = true;
    const controller = new AbortController();

    // Check localStorage cache first for instant display
    try {
      const cached = localStorage.getItem('cached_saved_jobs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedJobs(parsed);
          setLoading(false);
        }
      }
    } catch {}

    const loadSavedJobs = async () => {
      try {
        const response = await fetch('/api/saved-jobs', {
          method: 'GET',
          headers: {
            'x-user-id': effectiveUserId,
          },
          signal: controller.signal,
        });

        if (response.ok) {
          const data = (await response.json()) as SavedJobRecord[];
          if (active && Array.isArray(data)) {
            setSavedJobs(data);
            try {
              localStorage.setItem('cached_saved_jobs', JSON.stringify(data));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Network load for saved jobs deferred to local state');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSavedJobs();

    return () => {
      active = false;
      controller.abort();
    };
  }, [effectiveUserId, isReady]);

  const removeSavedJob = async (jobId: string) => {
    // Optimistic UI update
    setSavedJobs((current) => {
      const updated = current.filter((item) => item.jobId !== jobId && item.id !== jobId);
      try {
        localStorage.setItem('cached_saved_jobs', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await fetch(`/api/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': effectiveUserId,
        },
      });
    } catch (err) {
      console.error('Failed to remove saved job from server', err);
    }
  };

  const renderContent = () => {
    if (!isReady || loading) {
      return (
        <Card hover={false} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </Card>
      );
    }

    if (savedJobs.length === 0) {
      return (
        <Card hover={false} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-900">No saved jobs yet</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Tap the bookmark icon on any job card while browsing to revisit and apply later.
          </p>
          <Link href="/job-updates" className="mt-5 inline-block">
            <Button size="md" className="bg-blue-600 text-white rounded-full px-6">
              Browse Job Updates
            </Button>
          </Link>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <Card key={job.id} hover={false} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium">{job.jobType}</span>
                  <span className="font-semibold text-slate-800">{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-slate-950 leading-snug">{job.jobTitle}</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  {job.salary && <span className="font-semibold text-slate-800">₹ {job.salary}</span>}
                  {job.deadline && <span>Deadline: {job.deadline}</span>}
                  <span>Saved on {new Date(job.savedDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 items-center sm:items-end shrink-0">
                <Link
                  href={job.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  Apply now
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSavedJob(job.jobId || job.id)}
                  className="rounded-full text-xs text-slate-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-28 pt-6 sm:pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/job-updates"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">Saved Jobs</h1>
            <p className="text-xs text-slate-500 mt-0.5">Your bookmarked career opportunities</p>
          </div>
        </div>

        <div>{renderContent()}</div>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
