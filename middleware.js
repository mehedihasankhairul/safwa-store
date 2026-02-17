import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin routes that need protection (except admin login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for token and user in cookies (set by client-side auth)
    const token = request.cookies.get('token')?.value;
    const userCookie = request.cookies.get('user')?.value;

    // If no token, redirect to admin login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if user is admin (if user cookie exists)
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user.role !== 'admin') {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      } catch (e) {
        // Invalid user data, redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    // Add token to headers for API calls
    const response = NextResponse.next();
    response.headers.set('x-auth-token', token);
    return response;
  }
  
  // Redirect old /login route to home (users should use modal)
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect checkout and order routes for authenticated users
  if (pathname.startsWith('/checkout') || pathname.startsWith('/order')) {
    const userToken = request.cookies.get('user-token')?.value ||
                     request.headers.get('authorization')?.replace('Bearer ', '');

    if (!userToken && pathname !== '/checkout') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/order/:path*',
    '/invoices/:path*',
    '/login'
  ]
};
