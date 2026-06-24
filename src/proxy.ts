import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/forgot-password') || 
    pathname.startsWith('/reset-password') || 
    pathname.startsWith('/verify-email');
    
  const isProtectedRoute = pathname.startsWith('/client') || pathname.startsWith('/admin');

  // Redirect authenticated users away from auth pages to their respective dashboard
  if (token && isAuthPage) {
    const role = token.role || 'customer';
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.redirect(new URL('/client/dashboard', req.url));
  }

  // Redirect unauthenticated users to login page
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent non-admin users from accessing admin routes
  if (pathname.startsWith('/admin') && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/client/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/client/:path*', 
    '/admin/:path*', 
    '/login', 
    '/signup', 
    '/forgot-password', 
    '/reset-password', 
    '/verify-email'
  ]
};
