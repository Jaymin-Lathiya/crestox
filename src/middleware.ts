import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // If user is logged in (has a token) and tries to access login or signup pages,
    // redirect them to the home page (or dashboard)
    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/signup'],
};
