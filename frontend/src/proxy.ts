import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Admin Route Protection
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') return NextResponse.next();
    
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
    
    return NextResponse.next();
  }

  // Student Route Protection
  if (path.startsWith('/student/dashboard')) {
    const token = request.cookies.get('student_token')?.value;
    if (!token) {
      const loginUrl = new URL('/student/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/dashboard'],
};
