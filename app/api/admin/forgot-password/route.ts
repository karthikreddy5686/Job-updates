import { NextResponse } from 'next/server'
import { generateOTP, getAdminCredentials } from '@/lib/admin-storage'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const adminCreds = getAdminCredentials()
    
    if (email !== adminCreds.email) {
      return NextResponse.json({ success: false, error: 'Email not found' }, { status: 404 })
    }

    const otp = generateOTP(email)
    console.log(`[MOCK EMAIL/SMS] Admin OTP for ${email}: ${otp}`)

    return NextResponse.json({ success: true, message: 'OTP sent successfully', mockOtp: otp })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
