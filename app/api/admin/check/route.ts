import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_KEY } from '@/lib/admin-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get(ADMIN_KEY)?.value === 'true'
  return NextResponse.json({ authenticated: isAdmin })
}
