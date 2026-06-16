import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'jobupdate_admin_auth'
const LOGIN_PATH = '/admin/login'
const DASHBOARD_PATH = '/admin/dashboard'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAuthenticated =
    req.cookies.get(ADMIN_COOKIE)?.value === 'true'

  // Allow all non-admin routes through
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow login page always
  if (pathname === LOGIN_PATH || 
      pathname === '/admin/login/') {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(DASHBOARD_PATH, req.url)
      )
    }
    return NextResponse.next()
  }

  // All other /admin/* routes need auth
  if (!isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: ['/admin/:path*'],
}
