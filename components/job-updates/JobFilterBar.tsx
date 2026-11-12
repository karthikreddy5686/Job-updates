'use client';

import React, { useState, useMemo } from 'react';
import {
  Filter,
  GraduationCap,
  Briefcase,
  MapPin,
  Sparkles,
  X,
  ChevronDown,
  Check,
  RotateCcw,
  Building2,
  Flame,
  Layers,
  Banknote,
} from 'lucide-react';
import type { DailyJob } from '@/types/jobs';

export interface JobFilterState {
  experience: 'all' | 'fresher' | '0-1' | '1-3';
  batch: 'all' | '2026' | '2025' | '2024';
  workMode: 'all' | 'remote' | 'hybrid' | 'onsite';
  jobType: 'all' | 'full-time' | 'internship';
  department: 'all' | 'it-software' | 'core' | 'civil-mech' | 'banking';
  minSalary: 'all' | '3lpa' | '6lpa' | '10lpa';
  urgentOnly: boolean;
  sortBy: 'newest' | 'salary-high';
}

export const initialFilterState: JobFilterState = {
  experience: 'all',
  batch: 'all',
  workMode: 'all',
  jobType: 'all',
  department: 'all',
  minSalary: 'all',
  urgentOnly: false,
  sortBy: 'newest',
};

// Helper to determine if a job is suitable for freshers
export function isFresherJob(job: DailyJob): boolean {
  const title = (job.title || '').toLowerCase();
  const cat = (job.category || '').toLowerCase();
  const jt = (job.jobType || '').toLowerCase();

  // Exclude explicit senior/lead roles
  if (/\b(senior|sr\.|lead|principal|architect|manager|head|director|staff|vp|7\+|8\+|10\+)\b/i.test(title)) {
    return false;
  }

  // Explicit fresher / entry / internship signals
  if (
    cat === 'internship' ||
    jt === 'internship' ||
    /\b(fresher|freshers|intern|internship|trainee|graduate|junior|jr\.|entry|associate|get|apprentice|campus|batch)\b/i.test(title)
  ) {
    return true;
  }

  // On student portal, standard entry roles without senior labels are open to freshers
  return true;
}

// Helper to parse annual CTC / LPA from salary strings
export function parseSalaryLpa(salary?: string): number {
  if (!salary) return 0;
  const s = salary.toLowerCase();

  const lpaMatch = s.match(/(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*lpa/);
  if (lpaMatch) {
    return parseFloat(lpaMatch[2] || lpaMatch[1]);
  }

  const monthlyMatch = s.match(/(\d[\d,]*)(?:\s*-\s*(\d[\d,]*))?\s*monthly/);
  if (monthlyMatch) {
    const num = parseFloat((monthlyMatch[2] || monthlyMatch[1]).replace(/,/g, ''));
    return (num * 12) / 100000;
  }

  const generalNum = s.match(/(\d[\d,]*)/);
  if (generalNum) {
    const val = parseFloat(generalNum[1].replace(/,/g, ''));
    if (val < 100) return val;
    if (val > 10000) return (val * 12) / 100000;
  }

  return 0;
}

// Master filter function
export function applyJobFilters(
  jobs: DailyJob[],
  filters: JobFilterState,
  searchQuery?: string
): DailyJob[] {
  let list = jobs;

  // 1. Text Search
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter((job) => {
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchLocation = (job.location || '').toLowerCase().includes(q);
      const matchCategory = (job.category || '').toLowerCase().includes(q);
      return matchTitle || matchCompany || matchLocation || matchCategory;
    });
  }

  // 2. Experience Filter (with prominent student/fresher support)
  if (filters.experience === 'fresher') {
    list = list.filter((job) => isFresherJob(job));
  } else if (filters.experience === '0-1') {
    list = list.filter((job) => {
      const t = job.title.toLowerCase();
      return isFresherJob(job) || /\b(0-1|0 to 1|1 yr|entry|associate)\b/i.test(t);
    });
  } else if (filters.experience === '1-3') {
    list = list.filter((job) => {
      const t = job.title.toLowerCase();
      return /\b(1-2|1-3|2-3|1 to 3|experienced|mid)\b/i.test(t) || !isFresherJob(job);
    });
  }

  // 3. Batch Filter (Student Graduation Year)
  if (filters.batch !== 'all') {
    const year = filters.batch;
    list = list.filter((job) => {
      const text = `${job.title} ${job.company} ${job.location}`.toLowerCase();
      // If job explicitly mentions the batch year, or is a fresher job without negative batch restrictions
      if (text.includes(year)) return true;
      if (isFresherJob(job) && !text.match(/batch\s*(202[0-9])/)) return true;
      return false;
    });
  }

  // 4. Work Mode
  if (filters.workMode === 'remote') {
    list = list.filter((job) => {
      const loc = (job.location || '').toLowerCase();
      return job.jobType === 'remote' || loc.includes('remote') || loc.includes('home') || loc.includes('pan india');
    });
  } else if (filters.workMode === 'hybrid') {
    list = list.filter((job) => {
      const loc = (job.location || '').toLowerCase();
      return job.jobType === 'hybrid' || loc.includes('hybrid');
    });
  } else if (filters.workMode === 'onsite') {
    list = list.filter((job) => {
      const loc = (job.location || '').toLowerCase();
      return job.jobType === 'onsite' || (!loc.includes('remote') && !loc.includes('home') && job.jobType !== 'remote');
    });
  }

  // 5. Job Type
  if (filters.jobType === 'internship') {
    list = list.filter((job) => {
      return (
        job.category === 'internship' ||
        job.jobType === 'internship' ||
        job.title.toLowerCase().includes('intern')
      );
    });
  } else if (filters.jobType === 'full-time') {
    list = list.filter((job) => {
      return job.category !== 'internship' && job.jobType !== 'internship';
    });
  }

  // 6. Department / Stream
  if (filters.department === 'it-software') {
    list = list.filter((job) => {
      const t = `${job.title} ${job.category}`.toLowerCase();
      return (
        job.category === 'mnc' ||
        job.category === 'startup' ||
        /\b(software|developer|frontend|backend|fullstack|web|python|java|react|engineer|cloud|ai|data|sde)\b/i.test(t)
      );
    });
  } else if (filters.department === 'core') {
    list = list.filter((job) => {
      const t = `${job.title} ${job.category}`.toLowerCase();
      return (
        job.category === 'core' ||
        /\b(embedded|vlsi|ece|eee|hardware|semiconductor|iot|electronics|circuit|pcb)\b/i.test(t)
      );
    });
  } else if (filters.department === 'civil-mech') {
    list = list.filter((job) => {
      const t = `${job.title} ${job.category}`.toLowerCase();
      return (
        job.category === 'civil' ||
        /\b(civil|mechanical|mech|autocad|cad|site|structural|quality|drdo|hvac)\b/i.test(t)
      );
    });
  } else if (filters.department === 'banking') {
    list = list.filter((job) => {
      const t = `${job.title} ${job.category} ${job.company}`.toLowerCase();
      return (
        job.category === 'banking' ||
        /\b(bank|banking|rbi|sbi|hdfc|icici|axis|finance|analyst|po|clerk)\b/i.test(t)
      );
    });
  }

  // 7. Minimum Salary (CTC)
  if (filters.minSalary === '3lpa') {
    list = list.filter((job) => parseSalaryLpa(job.salary) >= 3 || !job.salary);
  } else if (filters.minSalary === '6lpa') {
    list = list.filter((job) => parseSalaryLpa(job.salary) >= 6);
  } else if (filters.minSalary === '10lpa') {
    list = list.filter((job) => parseSalaryLpa(job.salary) >= 10);
  }

  // 8. Urgent Hiring Only
  if (filters.urgentOnly) {
    list = list.filter((job) => job.isNew);
  }

  // 9. Sorting
  return [...list].sort((a, b) => {
    if (filters.sortBy === 'salary-high') {
      return parseSalaryLpa(b.salary) - parseSalaryLpa(a.salary);
    }
    // Default newest first
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });
}

interface JobFilterBarProps {
  filters: JobFilterState;
  onChange: (filters: JobFilterState) => void;
  totalResultsCount: number;
  className?: string;
}

export default function JobFilterBar({
  filters,
  onChange,
  totalResultsCount,
  className = '',
}: JobFilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active filter count (excluding default 'all')
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.experience !== 'all') count++;
    if (filters.batch !== 'all') count++;
    if (filters.workMode !== 'all') count++;
    if (filters.jobType !== 'all') count++;
    if (filters.department !== 'all') count++;
    if (filters.minSalary !== 'all') count++;
    if (filters.urgentOnly) count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onChange(initialFilterState);
  };

  const toggleFresher = () => {
    onChange({
      ...filters,
      experience: filters.experience === 'fresher' ? 'all' : 'fresher',
    });
  };

  const toggleRemote = () => {
    onChange({
      ...filters,
      workMode: filters.workMode === 'remote' ? 'all' : 'remote',
    });
  };

  const toggleInternship = () => {
    onChange({
      ...filters,
      jobType: filters.jobType === 'internship' ? 'all' : 'internship',
    });
  };

  const toggleHighSalary = () => {
    onChange({
      ...filters,
      minSalary: filters.minSalary === '6lpa' ? 'all' : '6lpa',
    });
  };

  const toggleUrgent = () => {
    onChange({
      ...filters,
      urgentOnly: !filters.urgentOnly,
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 🚀 Horizontal Quick Filter Bar (Naukri App Style) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* All Filters Button with Filter Icon & Active Badge */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
            activeCount > 0
              ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          aria-label="Open all filters"
        >
          <Filter className={`w-3.5 h-3.5 ${activeCount > 0 ? 'text-white' : 'text-blue-600'}`} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="h-4 w-4 rounded-full bg-white text-blue-600 font-extrabold text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* 1. 🎓 Fresher (0 Yrs) — Prominent Student Special Chip */}
        <button
          onClick={toggleFresher}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
            filters.experience === 'fresher'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Freshers (0 Yrs)</span>
          {filters.experience === 'fresher' && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* 2. 💻 Work mode: Remote */}
        <button
          onClick={toggleRemote}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
            filters.workMode === 'remote'
              ? 'bg-slate-900 text-white border-slate-900 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Remote / WFH</span>
          {filters.workMode === 'remote' && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* 3. ⏳ Internships */}
        <button
          onClick={toggleInternship}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
            filters.jobType === 'internship'
              ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>Internships</span>
          {filters.jobType === 'internship' && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* 4. 💰 High CTC: ₹6+ LPA */}
        <button
          onClick={toggleHighSalary}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
            filters.minSalary === '6lpa'
              ? 'bg-amber-600 text-white border-amber-600 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>₹ 6+ LPA</span>
          {filters.minSalary === '6lpa' && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* 5. ⚡ Urgent Hiring */}
        <button
          onClick={toggleUrgent}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
            filters.urgentOnly
              ? 'bg-orange-600 text-white border-orange-600 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>Urgent Hiring</span>
          {filters.urgentOnly && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* 6. Batch Quick Dropdown Pill */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`shrink-0 h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1 transition-all shadow-2xs ${
            filters.batch !== 'all'
              ? 'bg-purple-600 text-white border-purple-600 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Batch {filters.batch !== 'all' ? filters.batch : ''}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {/* Clear All Pill if active */}
        {activeCount > 0 && (
          <button
            onClick={handleClearAll}
            className="shrink-0 h-8 px-2.5 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 📱 Full Filter Modal / Bottom Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">Filter Jobs</h3>
                  <p className="text-[11px] text-slate-400">
                    Showing {totalResultsCount} matching opportunities
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm">
              {/* 1. Student / Experience Section (Top Priority) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500">
                    Experience Level
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Students Favorite
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        experience: filters.experience === 'fresher' ? 'all' : 'fresher',
                      })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      filters.experience === 'fresher'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">🎓 Freshers (0 Yrs)</span>
                      {filters.experience === 'fresher' && (
                        <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      College grads & zero experience roles
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        experience: filters.experience === '0-1' ? 'all' : '0-1',
                      })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      filters.experience === '0-1'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">0 - 1 Years</span>
                      {filters.experience === '0-1' && (
                        <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Junior roles & early professionals
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filters,
                        experience: filters.experience === '1-3' ? 'all' : '1-3',
                      })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      filters.experience === '1-3'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">1 - 3 Years</span>
                      {filters.experience === '1-3' && (
                        <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Experienced associates
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange({ ...filters, experience: 'all' })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      filters.experience === 'all'
                        ? 'bg-slate-100 border-slate-700 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Any Experience</span>
                      {filters.experience === 'all' && (
                        <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Show all postings</p>
                  </button>
                </div>
              </div>

              {/* 2. Graduation Batch (For College Students) */}
              <div>
                <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500 block mb-2">
                  Graduation Batch
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Batches' },
                    { id: '2026', label: '2026 Batch (Final Year)' },
                    { id: '2025', label: '2025 Batch' },
                    { id: '2024', label: '2024 Batch' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() =>
                        onChange({ ...filters, batch: b.id as JobFilterState['batch'] })
                      }
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        filters.batch === b.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Work Mode */}
              <div>
                <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500 block mb-2">
                  Work Mode
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'remote', label: 'Remote' },
                    { id: 'hybrid', label: 'Hybrid' },
                    { id: 'onsite', label: 'On-site' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        onChange({ ...filters, workMode: m.id as JobFilterState['workMode'] })
                      }
                      className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        filters.workMode === m.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Job Type */}
              <div>
                <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500 block mb-2">
                  Job Type
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All Types' },
                    { id: 'full-time', label: 'Full-time' },
                    { id: 'internship', label: 'Internship' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        onChange({ ...filters, jobType: t.id as JobFilterState['jobType'] })
                      }
                      className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        filters.jobType === t.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Department / Stream */}
              <div>
                <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500 block mb-2">
                  Stream / Department
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Streams' },
                    { id: 'it-software', label: 'IT & Software Dev' },
                    { id: 'core', label: 'Core (ECE / EEE)' },
                    { id: 'civil-mech', label: 'Civil & Mechanical' },
                    { id: 'banking', label: 'Banking & Finance' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        onChange({ ...filters, department: d.id as JobFilterState['department'] })
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        filters.department === d.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Minimum Annual CTC / Salary */}
              <div>
                <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500 block mb-2">
                  Minimum Salary
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Any' },
                    { id: '3lpa', label: '₹ 3+ LPA' },
                    { id: '6lpa', label: '₹ 6+ LPA' },
                    { id: '10lpa', label: '₹ 10+ LPA' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        onChange({ ...filters, minSalary: s.id as JobFilterState['minSalary'] })
                      }
                      className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        filters.minSalary === s.id
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Sort By */}
              <div>
                <span className="font-bold text-slate-900 text-xs tracking-wide uppercase text-slate-500 block mb-2">
                  Sort Jobs By
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'newest', label: '⚡ Newest Today' },
                    { id: 'salary-high', label: '💰 Highest CTC' },
                  ].map((sort) => (
                    <button
                      key={sort.id}
                      type="button"
                      onClick={() =>
                        onChange({ ...filters, sortBy: sort.id as JobFilterState['sortBy'] })
                      }
                      className={`py-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                        filters.sortBy === sort.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="w-1/3 py-3 rounded-2xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-2/3 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors text-center"
              >
                Apply Filters ({totalResultsCount} Jobs)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
