import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createClient } from "@libsql/client/web";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/public");

  // Require auth token for anything not public and not an auth route
  if (!token && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // If there's a valid NextAuth token, we just let them in.
  // The 'users' table in DB is automatically populated via the signIn callback in route.ts
  if (token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
