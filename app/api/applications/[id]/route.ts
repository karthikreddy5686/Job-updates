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

const getUserId = (request: Request): string => request.headers.get('x-user-id') || 'guest_user';

export async function PATCH(request: Request, { params }: { params: any }) {
  try {
    const routeParams = params && typeof params.then === 'function' ? await params : params;
    const id = routeParams?.id;
    const userId = getUserId(request);
    const body = await request.json();

    const applications = await readJsonStorage<ApplicationRecord[]>(STORAGE_FILE, []);
    const index = applications.findIndex((app) => app.id === id && (app.userId === userId || userId === 'all'));

    if (index === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    applications[index] = {
      ...applications[index],
      ...body,
      id: applications[index].id,
      userId: applications[index].userId,
    };

    await writeJsonStorage(STORAGE_FILE, applications);
    return NextResponse.json(applications[index]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const routeParams = params && typeof params.then === 'function' ? await params : params;
    const id = routeParams?.id;
    const userId = getUserId(request);

    const applications = await readJsonStorage<ApplicationRecord[]>(STORAGE_FILE, []);
    const filtered = applications.filter((app) => !(app.id === id && (app.userId === userId || userId === 'all')));

    await writeJsonStorage(STORAGE_FILE, filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false });
  }
}
