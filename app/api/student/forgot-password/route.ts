import { NextResponse } from 'next/server'
import { generateOTP, getStudents } from '@/lib/admin-storage'

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json()
    const students = await getStudents()
    
    // Check if identifier exists (email or phone)
    const exists = students.some(s => s.email.toLowerCase() === identifier.toLowerCase() || s.phone === identifier)
    if (!exists) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const otp = await generateOTP(identifier)
    console.log(`[MOCK EMAIL/SMS] Student OTP for ${identifier}: ${otp}`)

    return NextResponse.json({ success: true, message: 'OTP sent successfully', mockOtp: otp })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
