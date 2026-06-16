import { NextResponse } from 'next/server';
import { getStudents } from '@/lib/admin-storage';

export async function GET(request: Request) {
  try {
    const students = await getStudents();
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ success: false, error: 'Failed to load students' }, { status: 500 });
  }
}
