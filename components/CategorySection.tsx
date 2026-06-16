'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { LucideProps } from 'lucide-react';
import { ChevronDown, RefreshCcw } from 'lucide-react';
import JobCard from '@/components/JobCard';
import type { DailyJob } from '@/types/jobs';
import { Button } from './ui/Button';

const governmentFallbackJobs: DailyJob[] = [
  {
    id: 'govt-upsc-2026',
    title: 'UPSC Civil Services Examination 2026',
    company: 'UPSC Official',
    location: 'New Delhi / Pan India',
    jobType: 'full-time',
    category: 'government',
    salary: '₹56,100–₹2,50,000/month',
    postedDate: new Date().toISOString(),
    deadline: 'June 15, 2026',
    applyLink: 'https://upsc.gov.in/examinations/active-examinations',
    isNew: true,
    source: 'UPSC',
  },
  {
    id: 'govt-ssc-cgl-2026',
    title: 'SSC CGL 2026 — Group B & C Recruitment',
    company: 'SSC Official',
    location: 'Pan India',
    jobType: 'full-time',
    category: 'government',
    salary: '₹25,500–₹1,51,100/month',
    postedDate: new Date().toISOString(),
    deadline: 'July 10, 2026',
    applyLink: 'https://ssc.gov.in/Portal/Notices',
    isNew: true,
    source: 'SSC',
  },
  {
    id: 'govt-rbi-grade-b-2026',
    title: 'RBI Grade B Officer Recruitment 2026',
    company: 'RBI Official',
    location: 'Pan India',
    jobType: 'full-time',
    category: 'government',
    salary: '₹55,200–₹1,16,684/month',
    postedDate: new Date().toISOString(),
    deadline: 'June 30, 2026',
    applyLink: 'https://opportunities.rbi.org.in/',
    isNew: true,
    source: 'RBI',
  },
];

interface CategorySectionProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  categoryKey: string;
  jobs: DailyJob[];
  newCount: number;
  lastUpdatedLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  hideLoadMore?: boolean;
}

export default function CategorySection({
  icon: Icon,
  title,
  description,
  categoryKey,
  jobs,
  newCount,
  lastUpdatedLabel,
  isExpanded,
  onToggle,
  onRefresh,
  hideLoadMore = false,
}: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isGovernmentEmpty = categoryKey === 'government' && jobs.length === 0;
  const renderedJobs = isGovernmentEmpty ? governmentFallbackJobs : jobs;
  const visibleJobs = (showAll || hideLoadMore) ? renderedJobs : renderedJobs.slice(0, 5);

  const categoryHref = `/job-updates/${categoryKey === 'startup' ? 'startups' : categoryKey}`;

  useEffect(() => {
    if (!isExpanded || !scrollContainerRef.current || renderedJobs.length === 0 || hideLoadMore) return;
    
    const container = scrollContainerRef.current;
    let animationFrameId: number;
    let lastTimestamp = 0;
    const speed = 25; // pixels per second

    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (!isHovered) {
        // Calculate scroll amount based on time elapsed for smooth performance
        container.scrollTop += (speed * deltaTime) / 1000;
        
        // Loop back seamlessly (using scrollHeight / 2 because we duplicated the items)
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }
      
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isExpanded, isHovered, renderedJobs.length, showAll]);

  return (
    <section className={`flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg ${hideLoadMore ? 'w-full' : 'h-full max-h-[550px]'}`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-5 bg-white z-10 relative">
        <Link 
          href={categoryHref}
          className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-black text-white shadow-sm shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-500 truncate">{description}</p>
          </div>
        </Link>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 shrink-0"
          aria-expanded={isExpanded ? 'true' : 'false'}
          aria-controls={`category-${categoryKey}`}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 bg-white z-10 relative">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
            {newCount} new
          </span>
          <p className="text-xs text-slate-500">{lastUpdatedLabel}</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-800 hover:text-slate-900 hover:bg-slate-100"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {isExpanded ? (
        <>
          <div 
            id={`category-${categoryKey}`} 
            className="flex-1 overflow-y-auto px-6 py-6"
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {renderedJobs.length === 0 ? (
              <div className="text-center py-12 text-base text-slate-500">
                <p className="font-medium mb-2">No matching jobs yet</p>
                <p className="text-sm">Try broadening the date or location filters to see more opportunities.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {visibleJobs.map((job, idx) => (
                  <JobCard key={`first-${job.id}-${idx}`} job={job} />
                ))}
                {/* Duplicate the list for seamless looping if we have items and scrolling is enabled */}
                {!hideLoadMore && visibleJobs.map((job, idx) => (
                  <JobCard key={`second-${job.id}-${idx}`} job={job} />
                ))}
              </div>
            )}
          </div>
          {!hideLoadMore && renderedJobs.length > 5 && (
            <div className="border-t border-slate-100 bg-white px-6 py-3 text-center z-10 relative shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowAll((value) => !value)}
                className="font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 w-full"
              >
                {showAll ? 'Show fewer' : `Load more (${renderedJobs.length - visibleJobs.length})`}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <button
            onClick={onToggle}
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            Click to expand and view jobs
          </button>
        </div>
      )}
    </section>
  );
}
