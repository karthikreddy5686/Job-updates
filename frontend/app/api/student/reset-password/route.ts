import { NextResponse } from 'next/server'
import { verifyOTP, updateStudentPassword } from '@/lib/admin-storage'

export async function POST(req: Request) {
  try {
    const { identifier, otp, newPassword } = await req.json()
    
    if (!verifyOTP(identifier, otp)) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
    }

    const newHash = Buffer.from(newPassword).toString('base64')
    const updated = updateStudentPassword(identifier, newHash)
    
    if (!updated) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
