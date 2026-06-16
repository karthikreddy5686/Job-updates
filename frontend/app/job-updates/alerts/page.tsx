'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, Clock, FolderSearch, Sparkles, User, ArrowLeft } from 'lucide-react';
import { Button, Card } from '@/app/components';
import { getStudentSession } from '@/lib/student-auth';

type Urgency = 'critical' | 'urgent' | 'soon' | 'upcoming';

type DeadlineAlert = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  deadline: string;
  applyLink: string;
  source: 'saved' | 'applied' | 'live';
  category: string;
  daysLeft: number;
  urgency: Urgency;
};

const urgencyMeta: Record<Urgency, { label: string; tone: string; badge: string; icon: string }> = {
  critical: { label: 'Critical', tone: 'bg-red-50 text-red-700', badge: 'bg-red-100 text-red-700', icon: '⚠️' },
  urgent: { label: 'Urgent', tone: 'bg-orange-50 text-orange-700', badge: 'bg-orange-100 text-orange-700', icon: '🔥' },
  soon: { label: 'Soon', tone: 'bg-amber-50 text-amber-700', badge: 'bg-amber-100 text-amber-700', icon: '⏳' },
  upcoming: { label: 'Upcoming', tone: 'bg-sky-50 text-sky-700', badge: 'bg-sky-100 text-sky-700', icon: '📅' },
};

const filters: Array<'all' | Urgency> = ['all', 'critical', 'urgent', 'soon', 'upcoming'];

const formatDeadlineDate = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const formatCountdown = (daysLeft: number) => {
  if (daysLeft <= 0) return 'Closes today';
  if (daysLeft === 1) return 'Closes tomorrow';
  return `Closes in ${daysLeft} days`;
};

export default function DeadlineAlertsPage() {
  const [student, setStudent] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [alerts, setAlerts] = useState<DeadlineAlert[]>([]);
  const [filter, setFilter] = useState<'all' | Urgency>('all');
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

  const effectiveUser = student ? { id: student.id || student.email, name: student.name, email: student.email } : (isAdmin ? { id: 'admin', name: 'Admin', email: 'admin@geonixanextjob.com' } : null);

  const fetchAlerts = async () => {
    if (!effectiveUser) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deadline-alerts', {
        headers: { 'x-user-id': effectiveUser.id },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || 'Unable to load deadline alerts.');
        setAlerts([]);
      } else {
        const data = (await response.json()) as DeadlineAlert[];
        setAlerts(Array.isArray(data) ? data : []);
      }
    } catch (reason) {
      console.error(reason);
      setError('Unable to load deadline alerts.');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) fetchAlerts();
  }, [effectiveUser?.id, isReady]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (effectiveUser) fetchAlerts();
    }, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [effectiveUser?.id]);

  const counts = useMemo(
    () => ({
      critical: alerts.filter((item) => item.urgency === 'critical').length,
      urgent: alerts.filter((item) => item.urgency === 'urgent').length,
      soon: alerts.filter((item) => item.urgency === 'soon').length,
      upcoming: alerts.filter((item) => item.urgency === 'upcoming').length,
      total: alerts.length,
    }),
    [alerts],
  );

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((alert) => alert.urgency === filter);
  }, [alerts, filter]);

  if (!isReady) return null;

  if (!effectiveUser) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50">
            <User className="mx-auto h-12 w-12 text-slate-700" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-950">Sign in to view deadline alerts</h1>
            <p className="mt-4 text-sm text-slate-500">Your deadline alerts are tied to your saved jobs and tracked applications.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Sign in
              </Link>
              <Link href="/auth/register" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                Register
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link href="/job-updates" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Deadline Alerts</p>
                  </div>
                  <h1 className="mt-2 text-4xl font-semibold text-slate-950">Real deadlines for your next applications</h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                    Never rely on placeholders again. This feed pulls deadlines from your saved jobs, tracked applications, and live listings with closing dates.
                  </p>
                </div>
                <Button onClick={fetchAlerts} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                  Refresh alerts
                </Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(['critical', 'urgent', 'soon', 'upcoming'] as Urgency[]).map((urgency) => (
                  <div key={urgency} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{urgencyMeta[urgency].label}</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">{counts[urgency]}</p>
                    <p className="mt-2 text-xs text-slate-500">closes in {urgency === 'critical' ? '0-2 days' : urgency === 'urgent' ? '3-7 days' : urgency === 'soon' ? '8-14 days' : '15-30 days'}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {filters.map((option) => {
                  const active = filter === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFilter(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {option === 'all' ? 'All' : urgencyMeta[option].label}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-3xl bg-slate-200" />
                        <div className="flex-1 space-y-3 py-1">
                          <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                          <div className="h-3 w-1/2 rounded-full bg-slate-200" />
                        </div>
                      </div>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="h-3 w-24 rounded-full bg-slate-200" />
                        <div className="h-3 w-20 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-14 text-center">
                  <FolderSearch className="mx-auto h-12 w-12 text-slate-400" />
                  <h2 className="mt-4 text-xl font-semibold text-slate-950">No deadlines found in the next 30 days</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Save jobs with deadlines or apply to tracked roles and they will appear here automatically.
                  </p>
                  <Link href="/job-updates" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                    Browse jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => {
                    const meta = urgencyMeta[alert.urgency];
                    return (
                      <article key={alert.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${meta.tone}`}>
                                {meta.icon}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{alert.jobTitle}</p>
                                <p className="text-sm text-slate-500">{alert.company} · {alert.location}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                              <span>{alert.category}</span>
                              <span>•</span>
                              <span>{alert.source === 'saved' ? 'Saved job' : alert.source === 'applied' ? 'Tracked application' : 'Live listing'}</span>
                            </div>
                          </div>
                          <div className="flex min-w-[12rem] flex-col items-start gap-2 text-sm text-slate-600 sm:items-end">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${meta.badge}`}>
                              {meta.label}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">{formatCountdown(alert.daysLeft)}</span>
                            <span className="text-xs text-slate-500">{formatDeadlineDate(alert.deadline)}</span>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href={alert.applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            Apply now
                          </a>
                          {alert.source !== 'applied' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                            >
                              Mark applied
                            </Button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </Card>
          </section>

          <aside className="space-y-6">
            <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-xl font-bold text-white">
                  {effectiveUser.name?.slice(0, 2).toUpperCase() || effectiveUser.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Signed in as</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{effectiveUser.name || effectiveUser.email}</p>
                  <p className="text-sm text-slate-500">{effectiveUser.email}</p>
                </div>
              </div>
            </Card>

            <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
              <h2 className="text-sm font-semibold text-slate-950">Deadline intelligence</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Real deadlines are pulled from your saved jobs, tracked applications, and live listings with closing dates. Critical alerts appear first so you can act fast.
              </p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold">Saved job deadlines</span> are included when the job contains a closing date or deadline.
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold">Tracked application deadlines</span> are taken from your application records when you log a role with an interview or deadline date.
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold">Live listings</span> only show jobs closing in the next 30 days.
                </div>
              </div>
            </Card>

            <Card hover={false} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
              <div className="flex items-center gap-3 text-slate-500">
                <CalendarDays className="h-5 w-5" />
                <p className="text-sm leading-6">
                  Alerts refresh automatically every hour. You can also refresh manually to capture new deadline data immediately.
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
