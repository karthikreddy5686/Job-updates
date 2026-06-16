import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

type JobSource = 'saved' | 'live';

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
  source: JobSource;
}

const savedJobsPath = path.join(process.cwd(), 'data', 'savedJobs.json');

const ensureStorage = async () => {
  const dir = path.dirname(savedJobsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(savedJobsPath)) {
    fs.writeFileSync(savedJobsPath, '[]', 'utf8');
  }
};

const loadSavedJobs = async (): Promise<SavedJobRecord[]> => {
  await ensureStorage();
  const file = await fs.promises.readFile(savedJobsPath, 'utf8');
  try {
    return JSON.parse(file) as SavedJobRecord[];
  } catch (error) {
    fs.writeFileSync(savedJobsPath, '[]', 'utf8');
    return [];
  }
};

const saveSavedJobs = async (savedJobs: SavedJobRecord[]) => {
  await ensureStorage();
  await fs.promises.writeFile(savedJobsPath, JSON.stringify(savedJobs, null, 2), 'utf8');
};

const getUserId = (request: Request): string | null => {
  return request.headers.get('x-user-id') || null;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `saved_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const savedJobs = await loadSavedJobs();
  const userSaved = savedJobs
    .filter((job) => job.userId === userId)
    .sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
    });

  return NextResponse.json(userSaved);
}

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const savedJobs = await loadSavedJobs();
  const existingIndex = savedJobs.findIndex(
    (job) => job.userId === userId && job.jobId && body.jobId && job.jobId === body.jobId,
  );

  if (existingIndex !== -1) {
    savedJobs[existingIndex] = {
      ...savedJobs[existingIndex],
      jobTitle: body.jobTitle || savedJobs[existingIndex].jobTitle,
      company: body.company || savedJobs[existingIndex].company,
      companyLogo: body.companyLogo || savedJobs[existingIndex].companyLogo,
      location: body.location || savedJobs[existingIndex].location,
      jobType: body.jobType || savedJobs[existingIndex].jobType,
      applyLink: body.applyLink || savedJobs[existingIndex].applyLink,
      salary: body.salary || savedJobs[existingIndex].salary,
      deadline: body.deadline || savedJobs[existingIndex].deadline,
      source: body.source || savedJobs[existingIndex].source,
    };
    await saveSavedJobs(savedJobs);
    return NextResponse.json(savedJobs[existingIndex]);
  }

  const record: SavedJobRecord = {
    id: createId(),
    userId,
    jobId: body.jobId,
    jobTitle: body.jobTitle || 'Untitled role',
    company: body.company || 'Unknown company',
    companyLogo: body.companyLogo || '',
    location: body.location || 'Remote',
    jobType: body.jobType || 'remote',
    savedDate: new Date().toISOString(),
    deadline: body.deadline || undefined,
    applyLink: body.applyLink || '#',
    salary: body.salary || '',
    source: body.source || 'saved',
  };

  savedJobs.unshift(record);
  await saveSavedJobs(savedJobs);
  return NextResponse.json(record, { status: 201 });
}
