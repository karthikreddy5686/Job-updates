
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { fetchJobsWithDeadlines } from '@/lib/jobSources';

type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';

type ApplicationRecord = {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  appliedDate: string;
  status: ApplicationStatus;
  applyLink: string;
  notes?: string;
  salary?: string;
  deadline?: string;
  source: string;
};

type SavedJobRecord = {
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
  source: string;
};

type DashboardJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  interviewTime?: string;
};

type DashboardSummary = {
  applicationsThisWeek: number;
  interviewInvites: number;
  savedJobs: number;
  profileViews: number;
  nextInterview: {
    title: string;
    company: string;
    time: string;
  } | null;
};

const dataDir = path.join(process.cwd(), 'data');
const applicationsPath = path.join(dataDir, 'applications.json');
const savedJobsPath = path.join(dataDir, 'savedJobs.json');

const ensureStorage = async () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(applicationsPath)) {
    fs.writeFileSync(applicationsPath, '[]', 'utf8');
  }
  if (!fs.existsSync(savedJobsPath)) {
    fs.writeFileSync(savedJobsPath, '[]', 'utf8');
  }
};

const loadJsonFile = async <T>(filePath: string): Promise<T[]> => {
  await ensureStorage();

  try {
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as T[];
  } catch (error) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
};

const getUserId = (request: Request): string | null => {
  return request.headers.get('x-user-id') || null;
};

const formatApplicationStatus = (status: string) => {
  switch (status) {
    case 'applied':
      return 'Applied';
    case 'screening':
      return 'Screening';
    case 'interview':
      return 'Interview';
    case 'offered':
      return 'Offer';
    case 'rejected':
      return 'Rejected';
    default:
      return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  }
};

const buildInterviewTime = (application: ApplicationRecord) => {
  if (application.deadline) {
    const deadline = new Date(application.deadline);
    if (!Number.isNaN(deadline.getTime())) {
      return deadline.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  return 'TBD';
};

const mapApplication = (application: ApplicationRecord): DashboardJob => ({
  id: application.id,
  title: application.jobTitle,
  company: application.company,
  location: application.location,
  status: formatApplicationStatus(application.status),
  interviewTime: application.status === 'interview' || application.status === 'offered' ? buildInterviewTime(application) : undefined,
});

const mapSavedJob = (savedJob: SavedJobRecord): DashboardJob => ({
  id: savedJob.id,
  title: savedJob.jobTitle,
  company: savedJob.company,
  location: savedJob.location,
  status: 'Saved',
});

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [applications, savedJobs] = await Promise.all([
    loadJsonFile<ApplicationRecord>(applicationsPath),
    loadJsonFile<SavedJobRecord>(savedJobsPath),
  ]);

  const userApplications = applications
    .filter((application) => application.userId === userId)
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

  const userSavedJobs = savedJobs
    .filter((job) => job.userId === userId)
    .sort((a, b) => {
      const aDate = a.deadline ? new Date(a.deadline).getTime() : new Date(a.savedDate).getTime();
      const bDate = b.deadline ? new Date(b.deadline).getTime() : new Date(b.savedDate).getTime();
      return aDate - bDate;
    });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const applicationsThisWeek = userApplications.filter((application) => new Date(application.appliedDate).getTime() >= weekAgo.getTime()).length;
  const interviewInvites = userApplications.filter((application) => application.status === 'interview' || application.status === 'offered').length;

  const nextInterviewApplication = userApplications.find(
    (application) => application.status === 'interview' || application.status === 'offered',
  );

  const summary: DashboardSummary = {
    applicationsThisWeek,
    interviewInvites,
    savedJobs: userSavedJobs.length,
    profileViews: Math.max(0, userSavedJobs.length * 90 + applicationsThisWeek * 28 + interviewInvites * 15),
    nextInterview: nextInterviewApplication
      ? {
          title: nextInterviewApplication.jobTitle,
          company: nextInterviewApplication.company,
          time: buildInterviewTime(nextInterviewApplication),
        }
      : null,
  };

  const recommendations = await fetchJobsWithDeadlines().catch(() => []);
  const recommendationJobs = recommendations
    .slice(0, 4)
    .map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: 'Recommended',
    }));

  return NextResponse.json({
    summary,
    applications: userApplications.slice(0, 4).map(mapApplication),
    savedJobs: userSavedJobs.slice(0, 4).map(mapSavedJob),
    recommendations: recommendationJobs,
  });
}
