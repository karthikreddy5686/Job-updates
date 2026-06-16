import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const applicationsPath = path.join(process.cwd(), 'data', 'applications.json');

const ensureStorage = async () => {
  const dir = path.dirname(applicationsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(applicationsPath)) {
    fs.writeFileSync(applicationsPath, '[]', 'utf8');
  }
};

const loadApplications = async (): Promise<ApplicationRecord[]> => {
  await ensureStorage();
  const file = await fs.promises.readFile(applicationsPath, 'utf8');
  try {
    return JSON.parse(file) as ApplicationRecord[];
  } catch (error) {
    fs.writeFileSync(applicationsPath, '[]', 'utf8');
    return [];
  }
};

const saveApplications = async (applications: ApplicationRecord[]) => {
  await ensureStorage();
  await fs.promises.writeFile(applicationsPath, JSON.stringify(applications, null, 2), 'utf8');
};

const getUserId = (request: Request): string | null => {
  return request.headers.get('x-user-id') || null;
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const nextStatus = body.status as ApplicationStatus;
  if (!nextStatus) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const applications = await loadApplications();
  const index = applications.findIndex((application) => application.id === resolvedParams.id && application.userId === userId);

  if (index === -1) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  applications[index] = {
    ...applications[index],
    status: nextStatus,
    notes: body.notes !== undefined ? body.notes : applications[index].notes,
  };

  await saveApplications(applications);
  return NextResponse.json(applications[index]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await loadApplications();
  const index = applications.findIndex((application) => application.id === resolvedParams.id && application.userId === userId);

  if (index === -1) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  applications.splice(index, 1);
  await saveApplications(applications);

  return NextResponse.json({ success: true });
}
