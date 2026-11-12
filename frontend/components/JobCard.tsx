'use client';



import { useEffect, useState, useMemo } from 'react';
import type { DailyJob } from '@/types/jobs';
import { Button } from './ui/Button';

import { getStudentSession } from '@/lib/student-auth';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, Bookmark, Briefcase, CalendarDays, MapPin, Clock3, Sparkles, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  job: DailyJob;
  variant?: 'auto' | 'compact' | 'full';
  onSelect?: (job: DailyJob) => void;
}

export default function JobCard({ job, variant = 'auto', onSelect }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);

  const logoUrls = useMemo(() => {
    const urls: string[] = [];
    if (job.logo) urls.push(job.logo); // API's best guess

    // Auto-generate multiple fallback guesses based on the company name
    const cleanName = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const firstWord = job.company.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
    
    if (cleanName && !job.logo?.includes(cleanName)) {
      urls.push(`https://logo.clearbit.com/${cleanName}.com`);
      urls.push(`https://logo.clearbit.com/${cleanName}.in`);
    }
    if (firstWord && firstWord !== cleanName && !job.logo?.includes(firstWord)) {
      urls.push(`https://logo.clearbit.com/${firstWord}.com`);
    }
    return urls;
  }, [job.company, job.logo]);

  const posted = useMemo(() => formatRelativeTime(job.postedDate), [job.postedDate]);

  const [sessionUser, setSessionUser] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const student = getStudentSession();
    if (student) {
      setSessionUser({ id: student.id || student.email, name: student.name });
    } else if (localStorage.getItem('admin_session') === 'true') {
      setSessionUser({ id: 'admin', name: 'Admin' });
    } else {
      setSessionUser(null);
    }

    const handleAuthChange = () => {
      const s = getStudentSession();
      if (s) {
        setSessionUser({ id: s.id || s.email, name: s.name });
      } else if (localStorage.getItem('admin_session') === 'true') {
        setSessionUser({ id: 'admin', name: 'Admin' });
      } else {
        setSessionUser(null);
      }
    };

    window.addEventListener('studentLoggedIn', handleAuthChange);
    window.addEventListener('studentLoggedOut', handleAuthChange);
    window.addEventListener('adminLoggedIn', handleAuthChange);
    window.addEventListener('adminLoggedOut', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('studentLoggedIn', handleAuthChange);
      window.removeEventListener('studentLoggedOut', handleAuthChange);
      window.removeEventListener('adminLoggedIn', handleAuthChange);
      window.removeEventListener('adminLoggedOut', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!sessionUser) {
      setIsSaved(false);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/saved-jobs/${job.id}`, {
      method: 'GET',
      headers: {
        'x-user-id': sessionUser.id,
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!active) return null;
        if (!response.ok) return { saved: false };
        return response.json();
      })
      .then((data) => {
        if (!active || !data) return;
        setIsSaved(!!data.saved);
      })
      .catch(() => {
        if (active) {
          setIsSaved(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [job.id, sessionUser]);

  const toggleSaved = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!sessionUser) {
      window.location.href = '/';
      return;
    }

    setIsSaving(true);

    try {
      if (isSaved) {
        await fetch(`/api/saved-jobs/${job.id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': sessionUser.id,
          },
        });
        setIsSaved(false);
      } else {
        await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': sessionUser.id,
          },
          body: JSON.stringify({
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            companyLogo: job.logo || '',
            location: job.location,
            jobType: job.jobType,
            applyLink: job.applyLink,
            salary: job.salary || '',
            deadline: job.deadline || undefined,
            source: job.source || 'job board',
          }),
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to update saved job', error);
    } finally {
      setIsSaving(false);
    }
  };


  const handleApply = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sessionUser) {
      await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': sessionUser.id,
        },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          companyLogo: job.logo || '',
          location: job.location,
          jobType: job.jobType,
          applyLink: job.applyLink,
          salary: job.salary || '',
          deadline: job.deadline || undefined,
          source: job.source || 'job board',
        }),
      }).catch((error) => {
        console.error('Failed to track application', error);
      });
    }

    if (job.applyLink && job.applyLink.startsWith('http')) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    } else {
      router.push(`/jobs/${job.id}/apply`);
    }
  };

  const showCompactOnly = variant === 'compact' || variant === 'auto';
  const showFullOnly = variant === 'full';

  return (
    <>
      {/* 📱 Mobile Compact Tab Card (Exactly matching Screenshot 2) */}
      {!showFullOnly && (
        <article
          onClick={() => onSelect?.(job)}
          className={`${showCompactOnly ? 'block' : 'block sm:hidden'} rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md ${
            onSelect ? 'cursor-pointer hover:border-blue-300' : ''
          }`}
        >
          {/* Top row: Logo, Title, Company + Rating, Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 bg-white p-1 shadow-2xs flex items-center justify-center overflow-hidden">
                {logoIndex < logoUrls.length ? (
                  <img
                    src={logoUrls[logoIndex]}
                    alt={`${job.company} logo`}
                    className="h-full w-full object-contain"
                    onError={() => setLogoIndex((i) => i + 1)}
                  />
                ) : (
                  <Briefcase className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-1">
                  {job.title}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="truncate max-w-[130px]">{job.company}</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500 font-semibold text-[11px]">
                    ★ 3.8
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleSaved}
              disabled={isSaving}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              aria-label={isSaved ? 'Unsave job' : 'Save job'}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>
          </div>

          {/* Details Row: Location, Experience, Salary */}
          <div className="mt-3 space-y-1 text-xs text-slate-600 font-normal">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{job.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>
                {typeof job.jobType === 'string'
                  ? job.jobType.replace('-', ' ')
                  : Array.isArray(job.jobType)
                  ? (job.jobType as any[]).join(', ')
                  : '0-2 Yrs'}
              </span>
            </div>
            {job.salary ? (
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <span className="text-slate-400 font-semibold text-[13px]">₹</span>
                <span>{job.salary}</span>
              </div>
            ) : null}
          </div>

          {/* Badge & Relative Time */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div>
              {job.isNew ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/50">
                  ⚡ Urgent Hiring
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700 border border-orange-200/50">
                  🔥 2 Vacancies
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">{posted}</span>
          </div>

          {/* Full-width Apply Button (Pill style from screenshot) */}
          <div className="mt-3">
            <button
              onClick={handleApply}
              className="w-full py-2.5 rounded-full bg-[#EBF2FE] hover:bg-[#DDE9FD] active:scale-[0.99] text-[#2563EB] font-semibold text-sm transition-all text-center flex items-center justify-center shadow-2xs"
            >
              Apply
            </button>
          </div>
        </article>
      )}

      {/* 💻 Desktop Full Card View */}
      {!showCompactOnly && (
        <article
          onClick={() => onSelect?.(job)}
          className={`${showFullOnly ? 'hidden' : 'hidden sm:block'} group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            onSelect ? 'cursor-pointer hover:border-blue-400' : ''
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-slate-50 text-slate-600 shadow-sm overflow-hidden flex-shrink-0 border border-slate-100">
              {logoIndex < logoUrls.length ? (
                <img 
                  src={logoUrls[logoIndex]} 
                  alt={`${job.company} logo`} 
                  className="h-full w-full object-contain bg-white p-1" 
                  onError={() => setLogoIndex(i => i + 1)}
                />
              ) : (
                <Briefcase className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                <span>{job.source}</span>
                {job.isNew && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-700">
                    NEW TODAY
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 leading-tight">
                {job.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{job.company}</p>

              <div className="mt-4 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                  <Sparkles className="h-4 w-4 text-slate-400" />
                  {typeof job.jobType === 'string' ? job.jobType.replace('-', ' ') : (Array.isArray(job.jobType) ? (job.jobType as any[]).join(', ') : 'full time')}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  Posted: {posted}
                </span>
                {job.deadline && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Deadline: {job.deadline}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {job.salary ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                {job.salary}
              </span>
            ) : (
              <span className="text-xs uppercase tracking-[0.24em] text-slate-400">No salary listed</span>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
              <Button
                variant={isSaved ? 'ghost' : 'secondary'}
                size="md"
                onClick={toggleSaved}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 min-w-[120px]"
                aria-label={isSaved ? 'Unsave job' : 'Save job'}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleApply}
                className="inline-flex min-w-[150px] items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20 focus-visible:ring-orange-300"
              >
                Apply Now <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-right">
            <Link
              href={`/resume-match?jd=${encodeURIComponent(
                (job as any).description || job.title + ' at ' + job.company
              )}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#7C3AED] hover:text-[#5925b7]"
            >
              <Target className="w-4 h-4" />
              Match Resume
            </Link>
          </div>
        </article>
      )}
    </>
  );
}
