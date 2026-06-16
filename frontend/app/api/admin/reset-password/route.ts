import { NextResponse } from 'next/server'
import { verifyOTP, getAdminCredentials, updateAdminCredentials } from '@/lib/admin-storage'

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json()
    
    if (!await verifyOTP(email, otp)) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
    }

    const adminCreds = await getAdminCredentials()
    if (email !== adminCreds.email) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    await updateAdminCredentials(email, newPassword)
    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
