
import { NextResponse } from 'next/server';
import { invalidateAdminSession, getSessionTokenFromRequest, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const token = getSessionTokenFromRequest(request);
  await invalidateAdminSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  return response;
}
