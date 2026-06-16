import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateJob, deleteJob } 
  from '@/lib/admin-storage'
import { ADMIN_KEY } from '@/lib/admin-config'

export const dynamic = 'force-dynamic'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_KEY)?.value === 'true'
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  const updated = updateJob(id, body)
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, job: updated })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const deleted = deleteJob(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
