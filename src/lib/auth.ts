import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "survey_admin_token";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "";
}

/**
 * Checks if the current request has valid administrative credentials
 * via cookie or Authorization header.
 */
export function isAuthenticatedAdmin(request?: NextRequest): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  if (request) {
    // 1. Check Bearer token / header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.replace(/^Bearer\s+/i, "") === secret) {
      return true;
    }

    const headerKey = request.headers.get("x-admin-key");
    if (headerKey === secret) {
      return true;
    }

    // 2. Check Cookie in NextRequest
    const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (cookieToken === secret) {
      return true;
    }
  }

  // 3. Fallback for Server Components using next/headers
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return token === secret;
  } catch {
    return false;
  }
}
