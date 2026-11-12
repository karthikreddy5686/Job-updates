'use client';

import React, { useMemo, useRef } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Building2,
} from 'lucide-react';
import type { DailyJob } from '@/types/jobs';
import { formatRelativeTime } from '@/lib/utils';

interface RecommendedJobsCarouselProps {
  jobs: DailyJob[];
  student: any;
  onSelectJob: (job: DailyJob) => void;
  onApplyJob: (job: DailyJob) => void;
}

export default function RecommendedJobsCarousel({
  jobs,
  student,
  onSelectJob,
  onApplyJob,
}: RecommendedJobsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Read student skills & preferences from storage
  const candidateContext = useMemo(() => {
    let skills: string[] = ['python', 'java', 'react', 'sql', 'javascript'];
    let preferredRole = 'software';
    let preferredLocation = 'remote';

    try {
      const saved = localStorage.getItem('naukri_manual_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (Array.isArray(p.skills) && p.skills.length > 0) {
          skills = p.skills.map((s: string) => s.toLowerCase());
        }
        if (p.preferredRoles) preferredRole = p.preferredRoles.toLowerCase();
        if (p.location) preferredLocation = p.location.toLowerCase();
      }
    } catch {}

    return { skills, preferredRole, preferredLocation };
  }, [student]);

  // Calculate dynamic match scores for all jobs and pick top recommendations
  const scoredJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const scored = jobs.map((job) => {
      let score = 70; // baseline high score for verified board
      const text = `${job.title} ${job.company} ${job.location} ${job.category}`.toLowerCase();

      // Role match
      if (text.includes('software') || text.includes('developer') || text.includes('engineer')) {
        score += 12;
      }
      if (candidateContext.preferredRole && text.includes(candidateContext.preferredRole.split(' ')[0])) {
        score += 8;
      }

      // Work mode / location match
      if (job.jobType === 'remote' || text.includes('remote') || text.includes(candidateContext.preferredLocation)) {
        score += 6;
      }

      // Skills overlap
      candidateContext.skills.forEach((skill) => {
        if (text.includes(skill)) score += 3;
      });

      // Urgent hiring bonus
      if (job.isNew) score += 2;

      const finalMatch = Math.min(98, Math.max(85, score));

      return {
        job,
        matchPercentage: finalMatch,
      };
    });

    // Sort by highest match percentage and take top 5
    return scored.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);
  }, [jobs, candidateContext]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (scoredJobs.length === 0) return null;

  return (
    <div className="rounded-[24px] border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/50 p-6 shadow-sm relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-purple-200/40 blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Recommended For You
              </h2>
              <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                AI Match
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ranked highest based on your profile skills & preferred domains
            </p>
          </div>
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Cards */}
      <div
        ref={scrollRef}
        className="relative z-10 flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth"
      >
        {scoredJobs.map(({ job, matchPercentage }) => {
          const cleanName = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
          const logoUrl = job.logo || `https://logo.clearbit.com/${cleanName}.com`;
          const posted = formatRelativeTime(job.postedDate);

          return (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="w-[320px] sm:w-[350px] shrink-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top row: Logo, Title, Company + Rating + Match, Bookmark */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 bg-white p-1 shadow-2xs flex items-center justify-center overflow-hidden">
                      <img
                        src={logoUrl}
                        alt={`${job.company} logo`}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="truncate max-w-[110px]">{job.company}</span>
                        <span className="inline-flex items-center gap-0.5 text-amber-500 font-semibold text-[11px]">
                          ★ 3.8
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-200/50">
                          🎯 {matchPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectJob(job);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    aria-label="Quick view job"
                  >
                    <Bookmark className="h-4.5 w-4.5 text-slate-400" />
                  </button>
                </div>

                {/* Details Row: Location, Experience / Type */}
                <div className="mt-3 space-y-1 text-xs text-slate-600 font-normal">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="lowercase">
                      {typeof job.jobType === 'string'
                        ? job.jobType.replace('-', ' ')
                        : 'full time'}
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
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/50">
                      ⚡ Urgent Hiring
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{posted}</span>
                </div>
              </div>

              {/* Full-width Apply Button (Pill style from screenshot) */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyJob(job);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#EBF2FE] hover:bg-[#DDE9FD] active:scale-[0.99] text-[#2563EB] font-semibold text-sm transition-all text-center flex items-center justify-center shadow-2xs"
                >
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

