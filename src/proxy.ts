import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  defaultAuthenticatedRoute,
  isAuthenticationRoute,
  isProtectedRoute,
  loginRoute,
} from "@/app/config/routes";
import { authCache } from "@/lib/auth-cache";
import { getServerEnvironment } from "@/lib/env";
import { HttpMethodType } from "@/types/httpMethod";
import { HttpStatusType } from "@/types/httpStatus";

const AUTH_COOKIE_NAME = "access_token";
const CONTENT_SECURITY_POLICY_HEADER = "Content-Security-Policy";
const NONCE_HEADER = "x-nonce";

function originOf(rawUrl: string | undefined): string {
  if (!rawUrl) {
    return "";
  }

  try {
    return new URL(rawUrl).origin;
  } catch {
    return "";
  }
}

function buildContentSecurityPolicy(
  nonce: string,
  isDevelopment: boolean,
): string {
  const apiOrigin = originOf(process.env.NEXT_PUBLIC_API_URL);
  const storageOrigin = originOf(process.env.NEXT_PUBLIC_STORAGE_URL);

  const scriptSrc = isDevelopment
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const connectSrc = [
    "'self'",
    apiOrigin,
    storageOrigin,
    isDevelopment ? "ws: wss:" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imgSrc = ["'self'", "data:", "blob:", storageOrigin]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    isDevelopment ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");
}

function withContentSecurityPolicy(request: NextRequest): NextResponse {
  const isDevelopment = process.env.NODE_ENV === "development";
  const nonce = btoa(crypto.randomUUID());
  const policy = buildContentSecurityPolicy(nonce, isDevelopment);

  const requestHeaders = new Headers(request.headers);

  if (!isDevelopment) {
    requestHeaders.set(NONCE_HEADER, nonce);
    requestHeaders.set(CONTENT_SECURITY_POLICY_HEADER, policy);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(CONTENT_SECURITY_POLICY_HEADER, policy);

  return response;
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAME);

  if (!accessToken) {
    return false;
  }

  const cachedResult = authCache.get(accessToken.value);

  if (cachedResult !== null) {
    return cachedResult;
  }

  const cookieHeader = request.cookies
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const { apiUrlServer } = getServerEnvironment();

    const response = await fetch(`${apiUrlServer}/user`, {
      method: HttpMethodType.GET,
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
    });

    const authenticated =
      response.ok && response.status !== HttpStatusType.UNAUTHORIZED;

    authCache.set(accessToken.value, authenticated);

    return authenticated;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const userIsAuthenticated = await isAuthenticated(request);

  if (isAuthenticationRoute(pathname) && userIsAuthenticated) {
    return NextResponse.redirect(
      new URL(defaultAuthenticatedRoute, request.url),
    );
  }

  if (isProtectedRoute(pathname) && !userIsAuthenticated) {
    const loginUrl = new URL(loginRoute, request.url);
    const intendedPath = `${pathname}${request.nextUrl.search}`;

    if (intendedPath !== "/") {
      loginUrl.searchParams.set("redirect", intendedPath);
    }

    return NextResponse.redirect(loginUrl);
  }

  return withContentSecurityPolicy(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
