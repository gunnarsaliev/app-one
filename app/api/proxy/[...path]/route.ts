import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

async function handleProxy(
  req: NextRequest,
  ctx: RouteContext<"/api/proxy/[...path]">,
) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.RESOURCE_API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { error: "RESOURCE_API_URL is not configured" },
      { status: 500 },
    );
  }

  // /api/proxy/invoices/42?x=1 -> ${RESOURCE_API_URL}/api/invoices/42?x=1
  const { path } = await ctx.params;
  const targetUrl = `${apiUrl}/api/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;

  const headers = new Headers({ Authorization: `Bearer ${token}` });
  for (const name of ["content-type", "accept"]) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  let apiRes: Response;
  try {
    apiRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
  }

  // Pass the upstream body through as-is so non-JSON and empty (204) responses work
  const resHeaders = new Headers();
  const contentType = apiRes.headers.get("content-type");
  if (contentType) resHeaders.set("content-type", contentType);

  const res = new NextResponse(apiRes.body, {
    status: apiRes.status,
    headers: resHeaders,
  });
  // The API rejected the token (revoked or expired), so end the session
  if (apiRes.status === 401) res.cookies.delete(SESSION_COOKIE);
  return res;
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE,
};
