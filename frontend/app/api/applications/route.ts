import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { readJsonStorage, writeJsonStorage } from '@/lib/user-data-storage';

type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offered' | 'rejected';

interface ApplicationRecord {
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
}

const STORAGE_FILE = 'applications.json';

const getUserId = (request: Request): string => {
  return request.headers.get('x-user-id') || 'guest_user';
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `app_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const applications = await readJsonStorage<ApplicationRecord[]>(STORAGE_FILE, []);
    const userApplications = applications
      .filter((application) => application.userId === userId || userId === 'all')
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

    return NextResponse.json(userApplications);
  } catch (err) {
    console.error('Failed to get applications:', err);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const applications = await readJsonStorage<ApplicationRecord[]>(STORAGE_FILE, []);

    const application: ApplicationRecord = {
      id: createId(),
      userId,
      jobTitle: body.jobTitle || 'Untitled role',
      company: body.company || 'Unknown company',
      companyLogo: body.companyLogo || '',
      location: body.location || 'Remote',
      jobType: body.jobType || 'remote',
      appliedDate: new Date().toISOString(),
      status: 'applied',
      applyLink: body.applyLink || '#',
      notes: body.notes || '',
      salary: body.salary || '',
      deadline: body.deadline || undefined,
      source: body.source || 'unknown',
    };

    applications.unshift(application);
    await writeJsonStorage(STORAGE_FILE, applications);
    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    console.error('Failed to post application:', err);
    return NextResponse.json({ error: 'Failed to record application' }, { status: 500 });
  }
}
