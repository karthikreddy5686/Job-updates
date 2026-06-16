'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowLeft, Briefcase, Loader2, MapPin, Trash2, User, GraduationCap } from 'lucide-react';
import { Button, Card } from '@/app/components';
import { getStudentSession } from '@/lib/student-auth';

interface ApplicationItem {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  appliedDate: string;
  status: 'applied';
  applyLink: string;
  notes?: string;
  salary?: string;
  source: string;
}

const formatRelativeDate = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

export default function TrackerPage() {
  const [student, setStudent] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
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

  const fetchApplications = async () => {
    if (!effectiveUser) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/applications', {
        headers: { 'x-user-id': effectiveUser.id },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || 'Unable to load applications.');
        setApplications([]);
      } else {
        const data = await response.json();
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (reason) {
      console.error(reason);
      setError('Unable to load applications.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) fetchApplications();
  }, [effectiveUser?.id, isReady]);

  const removeApplication = async (appId: string) => {
    if (!effectiveUser) return;
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': effectiveUser.id },
      });
      if (response.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== appId));
      }
    } catch (err) {
      console.error('Failed to remove application', err);
    }
  };

  if (!isReady) return null;

  if (!effectiveUser) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center pt-24 md:pt-28">
        <div className="mx-auto max-w-md w-full px-4 text-center">
          <Card hover={false} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-lg">
            <User className="mx-auto h-12 w-12 text-slate-400" />
            <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Sign in to track applications</h1>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Keep your job application pipeline organized and never lose track of roles.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
                Go to Portal Gate
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="space-y-6">
            <Card hover={false} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link href="/job-updates" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600 dark:text-orange-400">Application Tracker</p>
                  </div>
                  <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Job Application Pipeline</h1>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Track and manage every role you've applied to in one convenient dashboard.
                  </p>
                </div>
                <Button onClick={fetchApplications} className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20">
                  Refresh tracker
                </Button>
              </div>
            </Card>

            <Card hover={false} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                  {applications.length} Applied Roles
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                  <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No applications tracked yet</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Apply to jobs from the main updates feed and they will automatically show up here.</p>
                  <Link href="/job-updates" className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors">
                    Browse Job Updates <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <article key={app.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
                          {app.companyLogo ? (
                            <img src={app.companyLogo} alt={app.company} className="w-full h-full object-contain rounded-xl" />
                          ) : (
                            <Briefcase className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">{app.jobTitle}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{app.company} · {app.location}</p>
                          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-400 dark:text-slate-500">
                            <span className="capitalize">{app.jobType}</span>
                            <span>•</span>
                            <span>Applied {formatRelativeDate(app.appliedDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <a href={app.applyLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-350">
                          View Listing
                        </a>
                        <button onClick={() => removeApplication(app.id)} className="p-2 border border-red-200 hover:bg-red-50 dark:border-red-950/40 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-colors" title="Delete application log">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <aside className="space-y-6">
            <Card hover={false} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-indigo-500 text-sm font-bold text-white shadow-md">
                  {effectiveUser.name?.slice(0, 2).toUpperCase() || 'JD'}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Signed In As</p>
                  <p className="mt-1 text-base font-bold text-slate-900 dark:text-white truncate">{effectiveUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{effectiveUser.email}</p>
                </div>
              </div>
            </Card>

            <Card hover={false} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Why Track Applications?</h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Keeping a record of your submissions helps you prepare for interviews, follow up on time, and build a systematic pipeline for your career search.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
