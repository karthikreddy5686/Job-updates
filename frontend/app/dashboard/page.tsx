'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Bell, Bookmark, Briefcase, CalendarDays, CheckCircle2, Sparkles, Users, Target } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDashboardData } from '@/hooks/useDashboardData';

const statusStyles: Record<string, string> = {
  Applied: 'bg-sky-100 text-sky-700',
  Screening: 'bg-amber-100 text-amber-700',
  Interview: 'bg-indigo-100 text-indigo-700',
  Offer: 'bg-emerald-100 text-emerald-700',
  Recommended: 'bg-violet-100 text-violet-700',
  Saved: 'bg-slate-100 text-slate-700',
};

const formatMetric = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return value.toString();
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const dashboard = useDashboardData(user);

  const displayName = user?.name?.split(' ')[0] || 'there';
  const roleLabel = user?.role === 'candidate' ? 'Candidate' : user?.role === 'recruiter' ? 'Recruiter' : 'Admin';

  const activityItems = [
    { label: 'Applied', value: dashboard.activity.applied, color: 'bg-sky-500' },
    { label: 'Screening', value: dashboard.activity.screening, color: 'bg-amber-500' },
    { label: 'Interview', value: dashboard.activity.interview, color: 'bg-indigo-500' },
    { label: 'Offers', value: dashboard.activity.offers, color: 'bg-emerald-500' },
  ];

  const summaryCards = [
    { label: 'Saved jobs', value: formatMetric(dashboard.summary.savedJobs), icon: Bookmark },
    { label: 'Interviews', value: formatMetric(dashboard.summary.interviewInvites), icon: CalendarDays },
    { label: 'Profile views', value: formatMetric(dashboard.summary.profileViews), icon: Sparkles },
    { label: 'Applications', value: formatMetric(dashboard.summary.applicationsThisWeek), icon: Briefcase },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm shadow-slate-200/50 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{user?.role === 'admin' ? 'Admin dashboard' : 'Candidate dashboard'}</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Welcome back, {displayName}.</h1>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Your career control center for saved opportunities, application progress, and tailored role recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Role: {roleLabel}
              </span>
              <Link
                href="/resume-match"
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Target className="h-4 w-4" />
                Resume Match
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse roles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {user?.role === 'admin' ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 shadow-sm shadow-slate-200/10 text-white sm:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Admin dashboard</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Admin quick actions</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  Manage platform users, job postings, notifications, and analytics from the admin workspace below.
                </p>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Open admin console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/admin/users"
                className="group rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Users</p>
                    <p className="mt-3 text-lg font-semibold text-white">Manage candidates</p>
                  </div>
                  <Users className="h-7 w-7 text-sky-300" />
                </div>
                <p className="mt-4 text-sm text-slate-400">Approve or suspend user accounts and review new registrations.</p>
              </Link>

              <Link
                href="/admin"
                className="group rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Listings</p>
                    <p className="mt-3 text-lg font-semibold text-white">Review job posts</p>
                  </div>
                  <Briefcase className="h-7 w-7 text-sky-300" />
                </div>
                <p className="mt-4 text-sm text-slate-400">Publish or archive jobs, then handle recruiter requests and approvals.</p>
              </Link>

              <Link
                href="/admin/notifications"
                className="group rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Notifications</p>
                    <p className="mt-3 text-lg font-semibold text-white">Send alerts</p>
                  </div>
                  <Bell className="h-7 w-7 text-sky-300" />
                </div>
                <p className="mt-4 text-sm text-slate-400">Quickly create and dispatch system notifications to all users.</p>
              </Link>

              <Link
                href="/admin"
                className="group rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Analytics</p>
                    <p className="mt-3 text-lg font-semibold text-white">View reports</p>
                  </div>
                  <BarChart3 className="h-7 w-7 text-sky-300" />
                </div>
                <p className="mt-4 text-sm text-slate-400">Monitor site performance, candidate activity, and recruiter engagement.</p>
              </Link>
            </div>
          </section>
        ) : null}

        {isLoading || dashboard.loading ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
            <p className="text-sm text-slate-500">Loading your dashboard...</p>
          </section>
        ) : dashboard.error ? (
          <section className="mt-8 rounded-[2rem] border border-rose-200 bg-rose-50 p-8 shadow-sm shadow-rose-200/50">
            <p className="text-lg font-semibold text-rose-900">Unable to load dashboard</p>
            <p className="mt-3 text-rose-700">{dashboard.error}</p>
            <p className="mt-3 text-sm text-rose-700">Refresh the page or try again later.</p>
          </section>
        ) : !user ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
            <p className="text-lg font-semibold text-slate-900">Sign in to access your dashboard</p>
            <p className="mt-3 text-slate-600">Your personalized job insights and saved opportunities appear here once you sign in.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/auth/login" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Sign in
              </Link>
              <Link href="/auth/register" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                Register
              </Link>
            </div>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{card.label}</p>
                          <p className="mt-4 text-3xl font-semibold text-slate-950">{card.value}</p>
                        </div>
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Career overview</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-950">Application and interview summary</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Next interview</span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Smart recommendations</span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Profile strength</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{dashboard.profileCompletion}%</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Saved jobs</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{dashboard.summary.savedJobs}</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Interviews scheduled</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{dashboard.summary.nextInterview ? dashboard.summary.nextInterview.time : 'None'}</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Applications</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Recent applications</h2>
                    </div>
                    <Link href="/jobs" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                      View all
                    </Link>
                  </div>

                  <div className="mt-6 space-y-4">
                    {dashboard.applications.length > 0 ? (
                      dashboard.applications.map((job) => (
                        <article key={job.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold text-slate-950">{job.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[job.status] || 'bg-slate-100 text-slate-700'}`}>
                              {job.status}
                            </span>
                          </div>
                          {job.interviewTime ? (
                            <p className="mt-4 text-sm text-slate-600">Interview scheduled for {job.interviewTime}</p>
                          ) : null}
                        </article>
                      ))
                    ) : (
                      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                        <p className="text-lg font-semibold text-slate-950">No applications tracked</p>
                        <p className="mt-2 text-sm">Apply to jobs to see your progress update here automatically.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Recommendations</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Role matches</h2>
                    </div>
                    <Sparkles className="h-8 w-8 text-slate-500" />
                  </div>

                  <div className="mt-6 space-y-4">
                    {dashboard.recommendations.length > 0 ? (
                      dashboard.recommendations.map((job) => (
                        <article key={job.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold text-slate-950">{job.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[job.status]}`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <span>Location: {job.location}</span>
                            <span>Recommended for you</span>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                        <p className="text-lg font-semibold text-slate-950">No recommendations available</p>
                        <p className="mt-2 text-sm">Complete your profile and save more jobs to receive tailored suggestions.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-900">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Your profile</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{user.name}</p>
                    <p className="text-sm text-slate-500">{roleLabel}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {dashboard.profileTasks.map((task) => (
                    <div key={task.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm text-slate-600">{task.name}</p>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${task.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {task.done ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Saved jobs</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{dashboard.summary.savedJobs}</p>
                  </div>
                  <Bookmark className="h-8 w-8 text-slate-500" />
                </div>

                {dashboard.savedJobs.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {dashboard.savedJobs.map((job) => (
                      <li key={job.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="font-semibold text-slate-950">{job.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{job.company}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                    Save jobs from the marketplace to keep them within easy reach.
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Weekly activity</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">Progress</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{dashboard.profileCompletion}%</span>
                </div>

                <div className="mt-6 space-y-4">
                  {activityItems.map((item) => {
                    const widthClass = item.value === 0 ? 'w-3' : item.value === 1 ? 'w-1/4' : item.value === 2 ? 'w-1/2' : item.value === 3 ? 'w-3/4' : 'w-full';
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className={`${item.color} h-full rounded-full ${widthClass}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
