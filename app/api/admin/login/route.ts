import { NextResponse } from 'next/server'
import { ADMIN_KEY } from '@/lib/admin-config'
import { getAdminCredentials } from '@/lib/admin-storage'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const adminCreds = getAdminCredentials()
    
    if (email === adminCreds.email && password === adminCreds.password) {
      const res = NextResponse.json({ success: true })
      res.cookies.set(ADMIN_KEY, 'true', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
      return res
    }
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
