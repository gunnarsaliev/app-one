import { NextRequest, NextResponse } from "next/server";
import { AUTH_URL, RETURN_TO_COOKIE, safeReturnTo } from "@/lib/session";

export function GET(req: NextRequest) {
  const loginUrl = new URL("/login", AUTH_URL);
  loginUrl.searchParams.set("redirect", `${req.nextUrl.origin}/callback`);

  // Remember where to send the user after /callback
  const res = NextResponse.redirect(loginUrl);
  res.cookies.set(RETURN_TO_COOKIE, safeReturnTo(req.nextUrl.searchParams.get("next")), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
