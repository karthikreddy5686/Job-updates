
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { ensureSeededAdmin, getAdminSession } from '@/lib/admin-auth';

export async function GET(request: Request) {
  await ensureSeededAdmin();

  const admin = await getAdminSession(request);

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ email: admin.email, role: admin.role });
}
