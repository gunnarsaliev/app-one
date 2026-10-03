import { NextRequest, NextResponse } from "next/server";
import { AUTH_URL, RETURN_TO_COOKIE, safeReturnTo, SESSION_COOKIE } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const failed = NextResponse.redirect(new URL("/login-failed", req.url));
  failed.cookies.delete(RETURN_TO_COOKIE);

  if (!token) return failed;

  // 1. Server-to-server exchange: one-time token -> central JWT
  let data: { success?: boolean; token?: string };
  try {
    const exchangeRes = await fetch(`${AUTH_URL}/api/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    if (!exchangeRes.ok) return failed;
    data = await exchangeRes.json();
  } catch {
    return failed;
  }

  if (!data.success || !data.token) return failed;

  // 2. Store the JWT in an HttpOnly cookie so client JS can never read it
  const returnTo = safeReturnTo(req.cookies.get(RETURN_TO_COOKIE)?.value);
  const res = NextResponse.redirect(new URL(returnTo, req.url));
  res.cookies.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7200, // 2 hours, matching the token expiration
  });
  res.cookies.delete(RETURN_TO_COOKIE);
  return res;
}
