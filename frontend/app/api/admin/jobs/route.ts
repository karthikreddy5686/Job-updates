import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getJobs, addJob } from '@/lib/admin-storage'
import { ADMIN_KEY } from '@/lib/admin-config'

export const dynamic = 'force-dynamic'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_KEY)?.value === 'true'
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: 'Unauthorized' }, { status: 401 }
    )
  }
  const jobs = getJobs()
  return NextResponse.json({ jobs })
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: 'Unauthorized' }, { status: 401 }
    )
  }
  const body = await req.json()
  if (!body.title || !body.company || !body.applyLink) {
    return NextResponse.json(
      { error: 'Title, company and apply link required' },
      { status: 400 }
    )
  }
  if (!body.applyLink.startsWith('http')) {
    return NextResponse.json(
      { error: 'Apply link must start with https://' },
      { status: 400 }
    )
  }
  const job = addJob({
    title: body.title.trim(),
    company: body.company.trim(),
    logo: body.logo?.trim() || '',
    location: body.location || 'India',
    jobType: body.jobType || 'full-time',
    category: body.category || 'mnc',
    salary: body.salary || '',
    applyLink: body.applyLink.trim(),
    deadline: body.deadline || '',
    description: body.description || '',
    isActive: true,
    isPinned: false,
    isFeatured: body.isFeatured || false,
  })
  return NextResponse.json({ success: true, job }, { status: 201 })
}
