import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to auth page, API routes, and static files
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // This middleware previously checked for session tokens, but the backend and auth are removed.
// If you need to add auth, use a frontend-only approach or Vercel's built-in integrations.

  // If no session token, redirect to auth page
  if (!sessionToken) {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = "/auth";
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
