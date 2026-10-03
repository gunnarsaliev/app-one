export const AUTH_URL = "https://auth.krotost.com";
export const SESSION_COOKIE = "central_jwt";
export const RETURN_TO_COOKIE = "login_return_to";
export const DEFAULT_RETURN_TO = "/dashboard";

/**
 * Checks the JWT's `exp` claim. The signature is NOT verified here — the
 * resource API does that. This only avoids treating an expired token as a
 * session. Malformed tokens count as expired.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: unknown };
    if (exp === undefined) return false;
    return typeof exp !== "number" || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function hasValidSession(token: string | undefined): token is string {
  return !!token && !isTokenExpired(token);
}

/** Only allow same-origin relative paths, to avoid open redirects. */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return DEFAULT_RETURN_TO;
  }
  return value;
}
