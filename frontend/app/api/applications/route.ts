import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `app_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await loadApplications();
  const userApplications = applications
    .filter((application) => application.userId === userId)
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

  return NextResponse.json(userApplications);
}

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
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

  const applications = await loadApplications();
  applications.unshift(application);
  await saveApplications(applications);

  return NextResponse.json(application, { status: 201 });
}
