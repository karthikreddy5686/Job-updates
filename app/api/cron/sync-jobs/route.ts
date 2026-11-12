import { NextResponse } from 'next/server';
import { syncJobsAndPurgeExpired } from '@/lib/job-sync-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await syncJobsAndPurgeExpired();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /api/cron/sync-jobs] Sync failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}

