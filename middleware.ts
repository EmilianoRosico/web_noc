import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'

const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Permitir el acceso a rutas públicas
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const cookie = req.headers.get('cookie')
  const cookies = cookie ? parse(cookie) : {}
  console.log('Middleware - Cookies:', cookies)

  if (!cookies['noc_user']) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
