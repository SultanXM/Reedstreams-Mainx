import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Blocked countries (ISO 3166-1 alpha-2 codes)
const BLOCKED_COUNTRIES = ['IL'] // Israel

export function middleware(request: NextRequest) {
  const country = request.geo?.country
  
  if (country && BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse('Access denied from your region.', { status: 403 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
