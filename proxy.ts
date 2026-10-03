import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasValidSession, SESSION_COOKIE } from "@/lib/session";

export function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (hasValidSession(token)) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  const res = pathname.startsWith("/api/proxy")
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : NextResponse.redirect(
        new URL(`/login?next=${encodeURIComponent(pathname + search)}`, req.url),
      );

  // Drop an expired or malformed token so it isn't sent again
  if (token) res.cookies.delete(SESSION_COOKIE);
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/proxy/:path*"],
};
