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

const getUserId = (request: Request): string => {
  return request.headers.get('x-user-id') || 'guest_user';
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `saved_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const savedJobs = await readJsonStorage<SavedJobRecord[]>(STORAGE_FILE, []);
    const userSaved = savedJobs
      .filter((job) => job.userId === userId || userId === 'all')
      .sort((a, b) => {
        if (a.deadline && b.deadline) {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      });

    return NextResponse.json(userSaved);
  } catch (err) {
    console.error('Failed to get saved jobs:', err);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const savedJobs = await readJsonStorage<SavedJobRecord[]>(STORAGE_FILE, []);
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
      await writeJsonStorage(STORAGE_FILE, savedJobs);
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
    await writeJsonStorage(STORAGE_FILE, savedJobs);
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error('Failed to post saved job:', err);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}
