import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAuthenticated =
    req.cookies.get('jobupdate_admin_auth')?.value === 'true'

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL('/admin/dashboard', req.url)
      )
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(
      new URL('/admin/login', req.url)
    )
  }

  return NextResponse.next()
}
