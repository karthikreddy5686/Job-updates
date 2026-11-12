import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { readJsonStorage, writeJsonStorage } from '@/lib/user-data-storage';

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

const STORAGE_FILE = 'savedJobs.json';

const getUserId = (request: Request): string => request.headers.get('x-user-id') || 'guest_user';

const findSavedJob = (savedJobs: SavedJobRecord[], userId: string, id: string) =>
  savedJobs.find((job) => job.userId === userId && (job.id === id || job.jobId === id));

export async function GET(request: Request, { params }: { params: any }) {
  try {
    const routeParams = params && typeof params.then === 'function' ? await params : params;
    const id = routeParams?.id;
    const userId = getUserId(request);

    const savedJobs = await readJsonStorage<SavedJobRecord[]>(STORAGE_FILE, []);
    const savedJob = findSavedJob(savedJobs, userId, id);

    if (!savedJob) {
      return NextResponse.json({ saved: false });
    }

    return NextResponse.json({ saved: true, job: savedJob });
  } catch (err) {
    return NextResponse.json({ saved: false });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const routeParams = params && typeof params.then === 'function' ? await params : params;
    const id = routeParams?.id;
    const userId = getUserId(request);

    const savedJobs = await readJsonStorage<SavedJobRecord[]>(STORAGE_FILE, []);
    const filtered = savedJobs.filter((job) => !(job.userId === userId && (job.id === id || job.jobId === id)));

    await writeJsonStorage(STORAGE_FILE, filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false });
  }
}
