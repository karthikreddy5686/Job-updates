import { NextResponse } from 'next/server'
import { getCompanyLogos, saveCompanyLogos } from '@/lib/admin-storage'

export async function GET() {
  const logos = await getCompanyLogos()
  return NextResponse.json({ logos })
}

export async function POST(request: Request) {
  try {
    const { logos } = await request.json()
    if (!Array.isArray(logos)) {
      return NextResponse.json({ error: 'Invalid logos array' }, { status: 400 })
    }
    
    // Simple validation
    const validLogos = logos.map((item: any) => ({
      company: String(item.company || ''),
      logo: String(item.logo || '')
    })).filter(l => l.company && l.logo)
    
    await saveCompanyLogos(validLogos)
    return NextResponse.json({ success: true, logos: validLogos })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save logos' }, { status: 500 })
  }
}
