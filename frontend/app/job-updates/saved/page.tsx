'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/app/components';
import { getStudentSession } from '@/lib/student-auth';
import { User, Loader2, ArrowLeft } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

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

  const effectiveUser = student 
    ? { id: student.id || student.email, name: student.name, email: student.email } 
    : (isAdmin ? { id: 'admin', name: 'Admin', email: 'admin@geonixanextjob.com' } : null);

  useEffect(() => {
    if (!effectiveUser) {
      setSavedJobs([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadSavedJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/saved-jobs', {
          method: 'GET',
          headers: {
            'x-user-id': effectiveUser.id,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to load saved jobs.');
        }

        const data = (await response.json()) as SavedJobRecord[];
        setSavedJobs(data);
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          setError((err as Error).message || 'Unable to load saved jobs.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();

    return () => controller.abort();
  }, [effectiveUser?.id, isReady]);

  const removeSavedJob = async (jobId: string) => {
    if (!effectiveUser) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': effectiveUser.id,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to remove saved job.');
      }

      setSavedJobs((current) => current.filter((item) => item.jobId !== jobId && item.id !== jobId));
    } catch (err) {
      setError((err as Error).message || 'Unable to remove saved job.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!isReady || loading) {
      return (
        <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </Card>
      );
    }

    if (!effectiveUser) {
      return (
        <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
          <User className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Sign in to view your saved jobs.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your saved roles are stored per account and can be accessed anytime from here.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button size="lg">Go to Portal Gate</Button>
            </Link>
          </div>
        </Card>
      );
    }

    if (error) {
      return (
        <Card hover={false} className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm dark:border-rose-500/20 dark:bg-rose-950/10">
          <p className="text-lg font-semibold text-rose-700 dark:text-rose-200">{error}</p>
        </Card>
      );
    }

    if (savedJobs.length === 0) {
      return (
        <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">No saved jobs yet</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Save jobs while browsing the board and they will show up here.
          </p>
          <Link href="/job-updates">
            <Button size="lg" className="mt-6">Browse Job Updates</Button>
          </Link>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {savedJobs.map((job) => (
          <Card key={job.id} hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">{job.jobType}</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{job.company}</span>
                    <span className="text-slate-400">•</span>
                    <span>{job.location}</span>
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{job.jobTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Saved on {new Date(job.savedDate).toLocaleDateString()}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                  {job.salary && <span>{job.salary}</span>}
                  {job.deadline && <span>Deadline: {job.deadline}</span>}
                  <span>Source: {job.source}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 items-start justify-center sm:items-end">
                <Link href={job.applyLink} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-3xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 sm:w-auto">
                  Apply now
                </Link>
                <Button variant="outline" size="lg" onClick={() => removeSavedJob(job.jobId || job.id)}>
                  Remove saved job
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white pt-24 md:pt-28">
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-[2rem] max-w-6xl mx-auto border border-slate-200/80 dark:border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/job-updates" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/50 hover:bg-white text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-950 dark:text-white">Saved Jobs</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Keep track of the jobs you want to revisit later. Remove saved roles once you're ready to apply.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </section>
    </div>
  );
}
