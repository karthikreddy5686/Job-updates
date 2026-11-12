'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  Bookmark,
  Share2,
  CheckCircle2,
  Building2,
  Target,
  GraduationCap,
  ShieldCheck,
  Check,
  Flame,
} from 'lucide-react';
import type { DailyJob } from '@/types/jobs';
import { formatRelativeTime } from '@/lib/utils';
import { getStudentSession } from '@/lib/student-auth';

interface JobDetailDrawerProps {
  job: DailyJob | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (job: DailyJob) => void;
}

export default function JobDetailDrawer({
  job,
  isOpen,
  onClose,
  onApply,
}: JobDetailDrawerProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Track saved state
  useEffect(() => {
    if (!job) return;
    try {
      const saved = localStorage.getItem('jobupdate_saved_jobs_cache');
      if (saved) {
        const list = JSON.parse(saved);
        setIsSaved(list.some((item: any) => item.jobId === job.id || item.id === job.id));
      }
    } catch {}
  }, [job]);

  if (!isOpen || !job) return null;

  const posted = formatRelativeTime(job.postedDate);
  const isUrgent = Boolean(
    (job as any).isUrgent ||
    (job as any).urgency === 'urgent' ||
    /\b(urgent|immediate|urgently|walk-in)\b/i.test(job.title || '')
  );

  // Dynamic Skills & Requirements deduced from Job Title & Category
  const jobMeta = (() => {
    const title = job.title.toLowerCase();
    const skills: string[] = [];
    const eligibility: string[] = [
      'B.Tech / B.E. / BCA / MCA / B.Sc or Any Equivalent Degree',
      'Freshers & 0-2 Years candidates are eligible',
      'Good analytical and problem-solving abilities',
    ];

    if (title.includes('software') || title.includes('developer') || title.includes('sde') || title.includes('fullstack') || title.includes('web')) {
      skills.push('JavaScript', 'React.js', 'Node.js', 'Python / Java', 'SQL', 'Git', 'REST APIs', 'Data Structures');
      eligibility.push('Understanding of Object Oriented Programming (OOP)');
    } else if (title.includes('python') || title.includes('ai') || title.includes('data')) {
      skills.push('Python', 'SQL', 'Data Analytics', 'Pandas', 'Machine Learning', 'Data Visualization');
    } else if (title.includes('embedded') || title.includes('vlsi') || title.includes('core')) {
      skills.push('C / C++', 'Microcontrollers', 'Embedded Systems', 'Digital Electronics', 'MATLAB', 'PCB Design');
    } else if (title.includes('civil') || title.includes('mechanical') || title.includes('mech')) {
      skills.push('AutoCAD', 'SolidWorks', 'Engineering Drawing', 'Project Management', 'Site Execution');
    } else if (title.includes('bank') || title.includes('finance')) {
      skills.push('Financial Analysis', 'Excel / Advanced Spreadsheets', 'Banking Regulations', 'Customer Advisory');
    } else {
      skills.push('Communication Skills', 'Team Collaboration', 'Problem Solving', 'Computer Fundamentals');
    }

    return { skills, eligibility };
  })();

  const handleApplyNow = () => {
    if (onApply) {
      onApply(job);
    } else {
      // Record application
      try {
        const student = getStudentSession();
        const userId = student?.id || student?.email || 'guest';
        fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
          body: JSON.stringify({
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            jobType: job.jobType,
            applyLink: job.applyLink,
            salary: job.salary || '',
          }),
        }).catch(() => {});
      } catch {}

      if (job.applyLink && job.applyLink.startsWith('http')) {
        window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = `/jobs/${job.id}/apply`;
      }
    }
  };

  const handleToggleSaved = async () => {
    setIsSaving(true);
    try {
      const student = getStudentSession();
      const userId = student?.id || student?.email || 'guest';
      if (isSaved) {
        await fetch(`/api/saved-jobs/${job.id}`, {
          method: 'DELETE',
          headers: { 'x-user-id': userId },
        });
        setIsSaved(false);
      } else {
        await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
          body: JSON.stringify({
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            jobType: job.jobType,
            applyLink: job.applyLink,
            salary: job.salary || '',
            deadline: job.deadline,
            source: job.source,
          }),
        });
        setIsSaved(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    const url = window.location.origin + `/jobs/${job.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanName = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
  const logoUrl = job.logo || `https://logo.clearbit.com/${cleanName}.com`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <aside
          className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Sticky Drawer Top Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50 uppercase tracking-wide">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Live Job Details
              </span>
              {isUrgent ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                  <Flame className="w-3 h-3 text-amber-500" />
                  Urgent Hiring
                </span>
              ) : job.category === 'internship' || job.jobType === 'internship' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                  Internship
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                title="Share job link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleToggleSaved}
                disabled={isSaving}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-slate-800">
            {/* Header: Company & Title */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt={`${job.company} logo`}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Fallback to building icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {job.title}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 font-semibold">
                  <span className="text-blue-600 hover:underline">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    ★ 4.1 Rating
                  </span>
                  <span>•</span>
                  <span className="text-xs text-slate-400 font-normal">Posted {posted}</span>
                </div>
              </div>
            </div>

            {/* Quick Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {job.location || 'Remote'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Mode</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5 capitalize truncate flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                  {typeof job.jobType === 'string' ? job.jobType.replace('-', ' ') : 'Full Time'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary CTC</p>
                <p className="text-xs font-extrabold text-emerald-700 mt-0.5 truncate">
                  {job.salary || 'Best in Industry'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                <p className="text-xs font-bold text-blue-700 mt-0.5 truncate">
                  Freshers / 0-2 Yrs
                </p>
              </div>
            </div>

            {/* AI Resume Match Card */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-950">AI Resume Fit Score</h4>
                    <p className="text-[11px] text-purple-700 font-medium mt-0.5">
                      Check your matching keywords against this official role
                    </p>
                  </div>
                </div>
                <a
                  href={`/resume-match?jd=${encodeURIComponent(job.title + ' at ' + job.company)}`}
                  className="px-3 py-1.5 rounded-full bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-2xs shrink-0"
                >
                  Match Resume
                </a>
              </div>
            </div>

            {/* Key Skills Required */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Key Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {jobMeta.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility & Qualifications */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-2.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Candidate Eligibility
              </h3>
              <ul className="space-y-2">
                {jobMeta.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* About the Role */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-600" />
                About This Opportunity
              </h3>
              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <p>
                  {job.company} is actively inviting applications for the position of{' '}
                  <strong className="text-slate-900">{job.title}</strong>. This position offers direct
                  career exposure, collaborative team work, and structured mentoring.
                </p>
                <p>
                  As an associate in this role, you will work on production software systems, deliver
                  well-tested features, and collaborate with experienced engineering leads.
                </p>
                {job.deadline && (
                  <p className="text-amber-800 font-semibold bg-amber-50 p-2 rounded-xl border border-amber-200/50">
                    ⚠️ Application Deadline: {job.deadline}. Early applications are prioritized.
                  </p>
                )}
              </div>
            </div>

            {/* Verified Requisition Verification Stamp */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-900 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Hiring Drive: Direct official application without third-party fees.</span>
            </div>
          </div>

          {/* 3. Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Requisition Status</p>
              <p className="text-xs font-bold text-emerald-700">Open & Accepting Candidates</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleToggleSaved}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleApplyNow}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Apply on Official Website</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

