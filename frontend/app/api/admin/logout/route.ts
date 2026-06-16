import { NextResponse } from 'next/server'
import { ADMIN_KEY } from '@/lib/admin-config'

export const dynamic = 'force-dynamic'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_KEY, '', { maxAge: 0, path: '/' })
  return res
}
