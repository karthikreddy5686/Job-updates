import { NextResponse } from 'next/server';
import { loginStudentServer } from '@/lib/admin-storage';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password } = data;
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const result = loginStudentServer(email, password);
    if (result.success) {
      return NextResponse.json({ success: true, student: result.student });
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
  }
}
