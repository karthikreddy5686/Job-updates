import { classifyDailyCategory } from './jobClassifier';
import type { DailyCategory, DailyJob, DailyJobType, DateRangeOption } from '@/types/jobs';

const normalizeDate = (value: string | number | undefined | null): Date | null => {
  if (!value) return null;
  
  if (typeof value === 'number') {
    const ms = value < 10000000000 ? value * 1000 : value;
    const parsed = new Date(ms);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const num = Number(value);
    const ms = num < 10000000000 ? num * 1000 : num;
    const parsed = new Date(ms);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatSalary = (min?: number, max?: number): string | undefined => {
  if (!min && !max) {
    return undefined;
  }

  if (min && max) {
    return min === max ? `₹${Math.round(min).toLocaleString()}` : `₹${Math.round(min).toLocaleString()} - ₹${Math.round(max).toLocaleString()}`;
  }

  return min ? `₹${Math.round(min).toLocaleString()}` : max ? `₹${Math.round(max).toLocaleString()}` : undefined;
};

const normalizeLocation = (value: string | string[] | undefined): string => {
  if (!value) return 'Remote';
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ') || 'Remote';
  }

  const trimmed = value.trim();
  return trimmed === '' ? 'Remote' : trimmed;
};

const normalizeJobType = (input: string | string[] | undefined): DailyJobType => {
  const value = Array.isArray(input) ? input.join(' ').toLowerCase() : (input || '').toLowerCase();

  if (value.includes('intern')) {
    return 'internship';
  }

  if (value.includes('hybrid')) {
    return 'hybrid';
  }

  if (value.includes('remote')) {
    return 'remote';
  }

  if (value.includes('onsite') || value.includes('office') || value.includes('on-site')) {
    return 'onsite';
  }

  return 'full-time';
};

const normalizeTags = (rawTags: unknown): string[] => {
  if (Array.isArray(rawTags)) {
    return rawTags.filter(Boolean).map(String);
  }
  if (typeof rawTags === 'string') {
    return rawTags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
};

const isDateInRange = (postedDate: string, start: Date, end: Date): boolean => {
  const parsed = normalizeDate(postedDate);
  if (!parsed) return false;
  return parsed.getTime() >= start.getTime() && parsed.getTime() <= end.getTime();
};

const parseDailyRange = (dateRange: string): { start: Date; end: Date } => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (dateRange === 'today') {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return { start: today, end };
  }

  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  if (dateRange === 'this-week') {
    const end = new Date(monday);
    end.setDate(monday.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start: monday, end };
  }

  if (dateRange === 'this-month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  const explicit = normalizeDate(dateRange);
  if (explicit) {
    const start = new Date(explicit);
    start.setHours(0, 0, 0, 0);
    const end = new Date(explicit);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  return parseDailyRange('today');
};

const buildDailyJob = (
  rawId: string,
  source: string,
  title: string,
  company: string,
  location: string,
  jobType: DailyJobType,
  postedDate: string,
  applyLink: string,
  category: DailyCategory | undefined,
  salary?: string,
  deadline?: string,
  logo?: string,
): DailyJob | undefined => {
  const parsedDate = normalizeDate(postedDate) || new Date();
  const isNew = (() => {
    const now = new Date();
    return (
      parsedDate.getDate() === now.getDate() &&
      parsedDate.getMonth() === now.getMonth() &&
      parsedDate.getFullYear() === now.getFullYear()
    );
  })();

  if (!applyLink) {
    return undefined;
  }

  return {
    id: `${source}:${rawId}`,
    title: title.trim(),
    company: company.trim() || 'Company',
    logo: logo?.trim(),
    location: normalizeLocation(location),
    jobType,
    category: category ?? 'startup',
    salary,
    postedDate: parsedDate.toISOString(),
    deadline: deadline?.trim() || undefined,
    applyLink: applyLink.trim(),
    isNew,
    source,
  };
};

const fetchAdzunaJobs = async (): Promise<DailyJob[]> => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    return [];
  }

  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}&results_per_page=30&content-type=application/json`;
  const response = await fetch(url);
  if (!response.ok) return [];

  const json = await response.json();
  const results = Array.isArray(json.results) ? json.results : [];

  return results
    .map((item: any) => {
      const title = String(item.title || item.title_full || '');
      const company = String(item.company?.display_name || item.company?.display_name || '');
      const location = String(item.location?.display_name || 'Remote');
      const tags = normalizeTags(item.category?.label);
      const category = classifyDailyCategory(title, company, item.description, tags, 'Adzuna');
      const jobType = normalizeJobType(item.contract_time || item.contract_timetable || '');
      const salary = formatSalary(item.salary_min, item.salary_max);
      return buildDailyJob(
        String(item.id || item._id || `${title}-${company}`),
        'Adzuna',
        title,
        company,
        location,
        jobType,
        String(item.created || item.created_at || ''),
        String(item.redirect_url || item.redirectUrl || ''),
        category,
        salary,
        item.application_deadline || item.expiration_date || undefined,
      );
    })
    .filter(Boolean) as DailyJob[];
};

const fetchRemotiveJobs = async (): Promise<DailyJob[]> => {
  const response = await fetch('https://remotive.com/api/remote-jobs');
  if (!response.ok) return [];

  const json = await response.json();
  const jobs = Array.isArray(json.jobs) ? json.jobs : [];

  return jobs
    .map((item: any) => {
      const title = String(item.title || '');
      const company = String(item.company_name || '');
      const location = normalizeLocation(String(item.candidate_required_location || 'Remote'));
      const tags = normalizeTags(item.tags);
      const category = classifyDailyCategory(title, company, item.description, tags, 'Remotive');
      const jobType = normalizeJobType(item.job_type || item.category || 'remote');
      return buildDailyJob(
        String(item.id || `${title}-${company}`),
        'Remotive',
        title,
        company,
        location,
        jobType,
        String(item.publication_date || item.publication_date || ''),
        String(item.url || ''),
        category,
        undefined,
        item.job_end_date || item.application_deadline || undefined,
        undefined,
      );
    })
    .filter(Boolean) as DailyJob[];
};

const fetchMuseJobs = async (): Promise<DailyJob[]> => {
  const response = await fetch('https://www.themuse.com/api/public/jobs?page=1');
  if (!response.ok) return [];

  const json = await response.json();
  const results = Array.isArray(json.results) ? json.results : [];

  return results
    .map((item: any) => {
      const title = String(item.name || item.title || '');
      const company = String(item.company?.name || '');
      const location = normalizeLocation(item.locations?.map((loc: any) => loc.name || '').filter(Boolean) || []);
      const tags = normalizeTags(item.levels?.map((level: any) => level.name) || []);
      const category = classifyDailyCategory(title, company, item.contents, tags, 'The Muse');
      const jobType = normalizeJobType(item.levels?.map((level: any) => level.name).join(' ') || item.remote ? 'remote' : 'onsite');
      return buildDailyJob(
        String(item.id || `${title}-${company}`),
        'The Muse',
        title,
        company,
        location,
        jobType,
        String(item.publication_date || item.publication_date || ''),
        String(item.refs?.landing_page || item.refs?.landing_page || item.refs?.weekly_page || ''),
        category,
        undefined,
        item.deadline || undefined,
        undefined,
      );
    })
    .filter(Boolean) as DailyJob[];
};

const fetchArbeitNowJobs = async (): Promise<DailyJob[]> => {
  const response = await fetch('https://arbeitnow.com/api/job-board-api');
  if (!response.ok) return [];

  const json = await response.json();
  const jobs = Array.isArray(json.data) ? json.data : [];

  return jobs
    .map((item: any) => {
      const title = String(item.title || '');
      const company = String(item.company_name || '');
      const location = normalizeLocation(String(item.location || item.remote ? 'Remote' : '')); 
      const tags = normalizeTags(item.tags);
      const category = classifyDailyCategory(title, company, item.description, tags, 'ArbeitNow');
      const jobType = item.remote ? 'remote' : normalizeJobType(String(item.location || 'onsite'));
      return buildDailyJob(
        String(item.slug || `${title}-${company}`),
        'ArbeitNow',
        title,
        company,
        location,
        jobType,
        String(item.created_at || ''),
        String(item.url || ''),
        category,
        undefined,
        item.deadline || item.closing_date || undefined,
        undefined,
      );
    })
    .filter(Boolean) as DailyJob[];
};

const normalizeCategoryParam = (categoryParam: string): DailyCategory | undefined => {
  const normalized = categoryParam.trim().toLowerCase();

  switch (normalized) {
    case 'internships':
    case 'internship':
      return 'internship';
    case 'mnc':
      return 'mnc';
    case 'government':
    case 'govt':
      return 'government';
    case 'banking':
      return 'banking';
    case 'startup':
    case 'startups':
      return 'startup';
    case 'cat':
    case 'cat-mba':
    case 'mba':
      return 'cat-mba';
    default:
      return undefined;
  }
};

const dedupeJobs = (jobs: DailyJob[]) => {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    const key = `${job.id}-${job.applyLink}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export async function fetchDailyJobs(categoryParam: string, dateRange: string): Promise<DailyJob[]> {
  const category = normalizeCategoryParam(categoryParam);
  if (!category) {
    throw new Error(`Unsupported daily category: ${categoryParam}`);
  }

  const range = parseDailyRange(dateRange || 'today');
  const sourceJobs = await Promise.all([fetchAdzunaJobs(), fetchRemotiveJobs(), fetchMuseJobs(), fetchArbeitNowJobs()]);
  const allJobs = sourceJobs.flat();

  const filtered = allJobs
    .filter((job) => job.category === category)
    .filter((job) => isDateInRange(job.postedDate, range.start, range.end))
    .filter((job) => Boolean(job.applyLink));

  return dedupeJobs(filtered).sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
}

export async function fetchJobsWithDeadlines(): Promise<DailyJob[]> {
  const sourceJobs = await Promise.all([fetchAdzunaJobs(), fetchRemotiveJobs(), fetchMuseJobs(), fetchArbeitNowJobs()]);
  const allJobs = sourceJobs.flat();

  const now = new Date();
  const threshold = new Date(now);
  threshold.setDate(now.getDate() + 30);

  return dedupeJobs(allJobs)
    .filter((job) => {
      if (!job.deadline) return false;
      const deadlineDate = normalizeDate(job.deadline);
      if (!deadlineDate) return false;
      return deadlineDate >= now && deadlineDate <= threshold;
    })
    .sort((a, b) => {
      const aDate = normalizeDate(a.deadline || '')?.getTime() ?? 0;
      const bDate = normalizeDate(b.deadline || '')?.getTime() ?? 0;
      return aDate - bDate;
    });
}
