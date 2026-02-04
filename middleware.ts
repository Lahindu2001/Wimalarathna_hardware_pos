import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

const publicPaths = ['/auth', '/api/login', '/api/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check auth for protected routes
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    // Redirect to auth if no token
    if (pathname === '/') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
