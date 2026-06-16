import { NextResponse } from 'next/server';
import { registerStudentServer } from '@/lib/admin-storage';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Invalid JSON payload:', parseError, rawBody);
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }
    const { name, email, password, phone, whatsapp, collegeName } = data;
    const result = registerStudentServer(name, email, password, phone, whatsapp, collegeName);
    if (result.success) {
      return NextResponse.json({ success: true, student: result.student });
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
  }
}
