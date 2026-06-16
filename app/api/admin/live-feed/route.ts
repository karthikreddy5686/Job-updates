import { NextResponse } from 'next/server'
import { getLiveFeedItems, saveLiveFeedItems, LiveFeedItem } from '@/lib/admin-storage'

export async function GET() {
  const items = await getLiveFeedItems()
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json()
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 })
    }
    
    // Simple validation
    const validItems = items.map((item: any) => ({
      id: item.id || crypto.randomUUID(),
      company: String(item.company || ''),
      role: String(item.role || ''),
      isNew: Boolean(item.isNew),
      postedTime: String(item.postedTime || '')
    }))
    
    await saveLiveFeedItems(validItems)
    return NextResponse.json({ success: true, items: validItems })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save items' }, { status: 500 })
  }
}
