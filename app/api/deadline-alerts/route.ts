import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fetchJobsWithDeadlines } from '@/lib/jobSources';

type JobSource = 'saved' | 'applied' | 'live';

type DeadlineAlert = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  deadline: string;
  applyLink: string;
  source: JobSource;
  category: string;
  daysLeft: number;
  urgency: 'critical' | 'urgent' | 'soon' | 'upcoming';
};

interface SavedJobRecord {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  savedDate: string;
  deadline?: string;
  applyLink: string;
  salary?: string;
  source: 'saved' | 'live';
}

interface ApplicationRecord {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  appliedDate: string;
  status: string;
  applyLink: string;
  notes?: string;
  salary?: string;
  deadline?: string;
  source: string;
}

const savedJobsPath = path.join(process.cwd(), 'data', 'savedJobs.json');
const applicationsPath = path.join(process.cwd(), 'data', 'applications.json');

const ensureStorage = async () => {
  const dir = path.dirname(savedJobsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(savedJobsPath)) {
    fs.writeFileSync(savedJobsPath, '[]', 'utf8');
  }

  if (!fs.existsSync(applicationsPath)) {
    fs.writeFileSync(applicationsPath, '[]', 'utf8');
  }
};

const loadJson = async <T>(filePath: string): Promise<T[]> => {
  await ensureStorage();
  const file = await fs.promises.readFile(filePath, 'utf8');
  try {
    return JSON.parse(file) as T[];
  } catch (error) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
};

const getUserId = (request: Request): string | null => {
  return request.headers.get('x-user-id') || null;
};

const calculateDaysLeft = (deadline: string, today: Date) => {
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) return Infinity;
  const diff = parsed.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const calculateUrgency = (daysLeft: number): DeadlineAlert['urgency'] => {
  if (daysLeft <= 2) return 'critical';
  if (daysLeft <= 7) return 'urgent';
  if (daysLeft <= 14) return 'soon';
  return 'upcoming';
};

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date();
  const threshold = new Date(today);
  threshold.setDate(today.getDate() + 30);

  const savedJobs = await loadJson<SavedJobRecord>(savedJobsPath);
  const applications = await loadJson<ApplicationRecord>(applicationsPath);

  const savedJobDeadlines = savedJobs
    .filter((job) => job.userId === userId && job.deadline)
    .map((job) => ({ ...job, deadline: job.deadline as string }))
    .filter((job) => {
      const deadlineDate = new Date(job.deadline);
      return !Number.isNaN(deadlineDate.getTime()) && deadlineDate >= today && deadlineDate <= threshold;
    })
    .map((job) => ({
      id: `saved:${job.id}`,
      jobTitle: job.jobTitle,
      company: job.company,
      location: job.location,
      deadline: job.deadline as string,
      applyLink: job.applyLink,
      source: 'saved' as const,
      category: job.jobType,
    }));

  const applicationDeadlines = applications
    .filter((app) => app.userId === userId && app.deadline)
    .map((app) => ({ ...app, deadline: app.deadline as string }))
    .filter((app) => {
      const deadlineDate = new Date(app.deadline);
      return !Number.isNaN(deadlineDate.getTime()) && deadlineDate >= today && deadlineDate <= threshold;
    })
    .map((app) => ({
      id: `applied:${app.id}`,
      jobTitle: app.jobTitle,
      company: app.company,
      location: app.location,
      deadline: app.deadline as string,
      applyLink: app.applyLink,
      source: 'applied' as const,
      category: app.jobType,
    }));

  const liveJobs = await fetchJobsWithDeadlines();
  const liveJobDeadlines = liveJobs.map((job) => ({
    id: `live:${job.id}`,
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    deadline: job.deadline as string,
    applyLink: job.applyLink,
    source: 'live' as const,
    category: job.category,
  }));

  const allDeadlines = [...savedJobDeadlines, ...applicationDeadlines, ...liveJobDeadlines]
    .map((item) => {
      const daysLeft = calculateDaysLeft(item.deadline, today);
      return {
        ...item,
        daysLeft,
        urgency: calculateUrgency(daysLeft),
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return NextResponse.json(allDeadlines);
}
