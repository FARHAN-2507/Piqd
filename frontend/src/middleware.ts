import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/dashboard', '/upload', '/curate/:path*', '/project/:path*'],
}

export function middleware(request: NextRequest) {
  return NextResponse.next()
}