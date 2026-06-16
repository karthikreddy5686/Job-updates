import { NextResponse } from 'next/server';
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

const getUserId = (request: Request): string | null => request.headers.get('x-user-id') || null;

const findSavedJob = (savedJobs: SavedJobRecord[], userId: string, id: string) =>
  savedJobs.find((job) => job.userId === userId && (job.id === id || job.jobId === id));

export async function GET(request: Request, { params }: { params: any }) {
  const routeParams = params && typeof params.then === 'function' ? await params : params;
  const id = routeParams?.id;
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const savedJobs = await loadSavedJobs();
  const savedJob = findSavedJob(savedJobs, userId, id);

  if (!savedJob) {
    return NextResponse.json({ saved: false });
  }

  return NextResponse.json({ saved: true, job: savedJob });
}

export async function DELETE(request: Request, { params }: { params: any }) {
  const routeParams = params && typeof params.then === 'function' ? await params : params;
  const id = routeParams?.id;
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const savedJobs = await loadSavedJobs();
  const index = savedJobs.findIndex(
    (job) => job.userId === userId && (job.id === id || job.jobId === id),
  );

  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [removed] = savedJobs.splice(index, 1);
  await saveSavedJobs(savedJobs);

  return NextResponse.json(removed);
}
