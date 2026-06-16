import { NextResponse } from 'next/server'
import { getLiveFeedItems } from '@/lib/admin-storage'

export async function GET() {
  const items = await getLiveFeedItems()
  return NextResponse.json({ items })
}
