'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Briefcase, Loader2, MapPin, Trash2, Layers, CheckCircle2 } from 'lucide-react';
import { Button, Card } from '@/app/components';
import { getStudentSession } from '@/lib/student-auth';
import MobileBottomNav from '@/components/job-updates/MobileBottomNav';

interface ApplicationItem {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';
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
  if (days <= 0) return 'today';
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

    // Check localStorage cache first
    try {
      const cached = localStorage.getItem('cached_applications');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApplications(parsed);
          setLoading(false);
        }
      }
    } catch {}

    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications', {
          headers: { 'x-user-id': effectiveUserId },
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          if (active && Array.isArray(data)) {
            setApplications(data);
            try {
              localStorage.setItem('cached_applications', JSON.stringify(data));
            } catch {}
          }
        }
      } catch (reason) {
        console.warn('Network load for applications deferred to local cache');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchApplications();

    return () => {
      active = false;
      controller.abort();
    };
  }, [effectiveUserId, isReady]);

  const removeApplication = async (id: string) => {
    setApplications((current) => {
      const updated = current.filter((item) => item.id !== id);
      try {
        localStorage.setItem('cached_applications', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': effectiveUserId },
      });
    } catch (err) {
      console.error('Failed to remove application from server', err);
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

    if (applications.length === 0) {
      return (
        <Card hover={false} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-900">No applications tracked yet</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            When you click "Apply" on any job, it is automatically logged here so you never lose track of where you applied.
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
      <div className="space-y-3.5">
        {applications.map((app) => (
          <Card key={app.id} hover={false} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 font-semibold text-[11px] border border-emerald-200/50">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Applied {formatRelativeDate(app.appliedDate)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{app.company}</span>
                </div>

                <h2 className="mt-2 text-lg font-bold text-slate-950 leading-snug">{app.jobTitle}</h2>

                <div className="mt-2.5 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.location}
                  </span>
                  {app.salary && <span className="font-semibold text-slate-800">₹ {app.salary}</span>}
                  <span>Type: {app.jobType}</span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 items-center sm:items-end shrink-0">
                {app.applyLink && app.applyLink !== '#' && (
                  <Link
                    href={app.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-1.5 text-xs font-semibold transition-colors"
                  >
                    View Job Link
                  </Link>
                )}
                <button
                  onClick={() => removeApplication(app.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Delete from tracker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">Application Tracker</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track your submitted job applications and status</p>
          </div>
        </div>

        <div>{renderContent()}</div>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
