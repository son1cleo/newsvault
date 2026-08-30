import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { sessionCookieName, verifySessionToken } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);
const intlMiddleware = createIntlMiddleware(routing);

async function adminGuard(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(sessionCookieName)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin and its API routes are not localized — handle auth and stop.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return adminGuard(request);
  }

  // Everything else (the public Voice of Bangla site) gets locale routing.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    // next-intl: match everything except Next internals, API routes, and
    // files with an extension (static assets).
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
