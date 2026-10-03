import { NextRequest, NextResponse } from "next/server";
import { RETURN_TO_COOKIE, SESSION_COOKIE } from "@/lib/session";

export function POST(req: NextRequest) {
  // 303 so the browser follows up with a GET
  const res = NextResponse.redirect(new URL("/login", req.url), 303);
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(RETURN_TO_COOKIE);
  return res;
}
