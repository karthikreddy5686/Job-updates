'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { jobCapabilities } from '@/data/jobCapabilities';
import type { DailyJob, DateRangeOption, JobTypeFilter, SortOption } from '@/types/jobs';

const DAILY_CATEGORIES = ['internships', 'mnc', 'government', 'banking', 'startup', 'cat-mba', 'core', 'civil'] as const;
export type DailyCategoryKey = (typeof DAILY_CATEGORIES)[number];

type JobsByCategory = Record<DailyCategoryKey, DailyJob[]>;

type KnownJobIdsRecord = Record<DailyCategoryKey, string[]>;

const JOB_ID_STORAGE = 'daily_jobs_known_ids';
const LAST_FETCH_STORAGE = 'daily_jobs_last_fetch';
const POLL_INTERVAL_MS = 30 * 60 * 1000;

const defaultFilters = {
  dateRange: 'today' as DateRangeOption,
  jobType: 'all' as JobTypeFilter,
  location: '',
  company: '',
  salaryRange: [0, 250000] as [number, number],
  sortBy: 'newest-first' as SortOption,
};

const buildEmptyJobs = (): JobsByCategory => {
  return DAILY_CATEGORIES.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as JobsByCategory);
};

const buildEmptyKnownIds = (): KnownJobIdsRecord => {
  return DAILY_CATEGORIES.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as KnownJobIdsRecord);
};

const loadKnownIds = (): KnownJobIdsRecord => {
  if (typeof window === 'undefined') return buildEmptyKnownIds();
  try {
    const raw = window.localStorage.getItem(JOB_ID_STORAGE);
    if (!raw) return buildEmptyKnownIds();
    const parsed = JSON.parse(raw) as Partial<KnownJobIdsRecord>;
    return { ...buildEmptyKnownIds(), ...(parsed || {}) };
  } catch (error) {
    console.error('Failed to load daily job ids from storage:', error);
    return buildEmptyKnownIds();
  }
};

const persistKnownIds = (state: KnownJobIdsRecord) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(JOB_ID_STORAGE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to persist daily job ids:', error);
  }
};

const loadLastFetch = (): string => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(LAST_FETCH_STORAGE) || '';
};

const persistLastFetch = (timestamp: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LAST_FETCH_STORAGE, timestamp);
  } catch (error) {
    console.error('Failed to persist daily jobs last fetch:', error);
  }
};

const requestNotificationPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => undefined);
  }
};

const buildBrowserNotification = (message: string) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification('JobUpdate Daily Alerts', { body: message });
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('JobUpdate Daily Alerts', { body: message });
      }
    });
  }
};

const parseSalaryValue = (salary?: string): number | undefined => {
  if (!salary) return undefined;
  const match = salary.match(/\d+(?:,\d+)*(?:\.\d+)?/);
  if (!match) return undefined;
  const digits = match[0].replace(/,/g, '');
  if (!digits) return undefined;
  return parseFloat(digits);
};

const isJobVisible = (
  job: DailyJob,
  filters: typeof defaultFilters,
): boolean => {
  const normalizedLocation = filters.location.trim().toLowerCase();
  const matchesLocation =
    !normalizedLocation ||
    job.location.toLowerCase().includes(normalizedLocation);

  const normalizedCompany = filters.company.trim().toLowerCase();
  const matchesCompany =
    !normalizedCompany ||
    job.company.toLowerCase().includes(normalizedCompany);

  const matchesJobType =
    filters.jobType === 'all' || job.jobType === filters.jobType;

  const salaryValue = parseSalaryValue(job.salary);
  const matchesSalary =
    salaryValue === undefined ||
    (salaryValue >= filters.salaryRange[0] && salaryValue <= filters.salaryRange[1]);

  return matchesLocation && matchesCompany && matchesJobType && matchesSalary;
};

const sortJobs = (jobs: DailyJob[], sortBy: SortOption): DailyJob[] => {
  return [...jobs].sort((a, b) => {
    if (sortBy === 'deadline-soon') {
      const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      if (aDeadline !== bDeadline) return aDeadline - bDeadline;
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });
};

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export function useDailyJobs() {
  const [jobsByCategory, setJobsByCategory] = useState<JobsByCategory>(buildEmptyJobs());
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Partial<Record<DailyCategoryKey, string>>>({});
  const [lastFetch, setLastFetch] = useState<string>('');
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));
  const previousIds = useRef<KnownJobIdsRecord>(buildEmptyKnownIds());

  const dailyCategories = useMemo(() => {
    return jobCapabilities.filter((item) => DAILY_CATEGORIES.includes(item.apiCategory as DailyCategoryKey));
  }, []);

  const refreshAll = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsLoading(true);
    const fetches = await Promise.all(
      dailyCategories.map(async (category) => {
        try {
          const response = await fetch(`/api/jobs/daily?category=${encodeURIComponent(category.apiCategory)}&date=${encodeURIComponent(filters.dateRange)}`);
          if (!response.ok) return { category: category.apiCategory as DailyCategoryKey, jobs: [] as DailyJob[] };
          const body = (await response.json()) as { jobs: DailyJob[] };
          return { category: category.apiCategory as DailyCategoryKey, jobs: body.jobs ?? [] };
        } catch (error) {
          console.error('Daily jobs fetch failed for', category.apiCategory, error);
          return { category: category.apiCategory as DailyCategoryKey, jobs: [] as DailyJob[] };
        }
      }),
    );

    const updatedJobs = buildEmptyJobs();
    const updatedLastUpdated: Partial<Record<DailyCategoryKey, string>> = {};
    const newKnownIds = buildEmptyKnownIds();
    let totalNewJobs = 0;

    const previousIdsSnapshot = previousIds.current;

    fetches.forEach(({ category, jobs }) => {
      updatedJobs[category] = jobs;
      updatedLastUpdated[category] = new Date().toISOString();
      newKnownIds[category] = jobs.map((job) => job.id);

      const oldIds = new Set(previousIdsSnapshot[category] || []);
      const added = jobs.filter((job) => !oldIds.has(job.id)).length;
      if (added > 0) {
        totalNewJobs += added;
      }
    });

    previousIds.current = newKnownIds;
    persistKnownIds(newKnownIds);

    const timestamp = new Date().toISOString();
    persistLastFetch(timestamp);
    setLastFetch(timestamp);
    setJobsByCategory(updatedJobs);
    setLastUpdated(updatedLastUpdated);
    setIsLoading(false);

    if (totalNewJobs > 0) {
      const message = `🔔 ${totalNewJobs} new job${totalNewJobs > 1 ? 's' : ''} just posted!`;
      setToastMessage(message);
      if (typeof document !== 'undefined' && !document.hasFocus()) {
        buildBrowserNotification(message);
      }
      window.setTimeout(() => setToastMessage(null), 5200);
    }
  }, [dailyCategories, filters.dateRange]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    previousIds.current = loadKnownIds();
    requestNotificationPermission();
    setLastFetch(loadLastFetch());
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = window.setInterval(refreshAll, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [refreshAll]);

  const filteredJobsByCategory = useMemo(() => {
    return DAILY_CATEGORIES.reduce((acc, category) => {
      const rawJobs = jobsByCategory[category] || [];
      const filtered = rawJobs.filter((job) => isJobVisible(job, filters));
      acc[category] = sortJobs(filtered, filters.sortBy);
      return acc;
    }, {} as JobsByCategory);
  }, [jobsByCategory, filters]);

  const countsByCategory = useMemo(() => {
    return DAILY_CATEGORIES.reduce((acc, category) => {
      acc[category] = (jobsByCategory[category] || []).filter((job) => job.isNew).length;
      return acc;
    }, {} as Record<DailyCategoryKey, number>);
  }, [jobsByCategory]);

  const totalNewJobs = useMemo(() => {
    return DAILY_CATEGORIES.reduce((sum, category) => sum + (countsByCategory[category] || 0), 0);
  }, [countsByCategory]);

  const lastUpdatedLabel = useCallback(
    (category: DailyCategoryKey) => {
      const value = lastUpdated[category];
      return value ? `Last updated: ${formatTimestamp(value)}` : 'Not updated yet';
    },
    [lastUpdated],
  );

  return {
    categories: dailyCategories,
    jobsByCategory: filteredJobsByCategory,
    rawJobsByCategory: jobsByCategory,
    countsByCategory,
    lastUpdated,
    lastUpdatedLabel,
    lastFetch,
    isLoading,
    toastMessage,
    filters,
    setFilters,
    refreshAll,
    totalNewJobs,
  };
}
