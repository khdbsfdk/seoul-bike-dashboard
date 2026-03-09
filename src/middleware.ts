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

  // Cross-reference user with Turso database
  if (token && token.email) {
    try {
      const db = createClient({
        url: process.env.TURSO_DATABASE_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN as string,
      });

      const result = await db.execute({
        sql: "SELECT * FROM allowed_users WHERE email = ?",
        args: [token.email],
      });

      if (result.rows.length === 0) {
        return new NextResponse(
          JSON.stringify({ error: "Access Denied. Your email is not whitelisted." }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        );
      }
    } catch (error) {
       console.error("Middleware DB error:", error);
       return new NextResponse("Internal Server Error: Database Connection Failed", { status: 500 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
