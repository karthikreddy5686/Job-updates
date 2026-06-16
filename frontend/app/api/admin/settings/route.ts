import { NextResponse } from 'next/server'
import { getAdminCredentials, updateAdminCredentials } from '@/lib/admin-storage'
import { cookies } from 'next/headers'
import { ADMIN_KEY } from '@/lib/admin-config'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const isAdmin = cookieStore.get(ADMIN_KEY)?.value === 'true'
    
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { email, password, newPassword } = await req.json()
    const adminCreds = await getAdminCredentials()

    // Validate old password
    if (password !== adminCreds.password) {
      return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 })
    }

    await updateAdminCredentials(email || adminCreds.email, newPassword || adminCreds.password)
    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
