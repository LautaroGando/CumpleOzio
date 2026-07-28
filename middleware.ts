import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value
    const expectedToken = process.env.ADMIN_PIN ?? 'ozio2025'

    if (adminToken !== expectedToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
