
import { NextResponse } from 'next/server';
import { ensureSeededAdmin, getAdminByEmail, verifyPassword, createAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  await ensureSeededAdmin();
  const admin = await getAdminByEmail(email);

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = await createAdminSession(admin.id);
  const response = NextResponse.json({ success: true, redirect: '/admin/dashboard', email: admin.email });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
  });

  return response;
}
