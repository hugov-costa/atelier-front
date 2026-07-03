import { isAuthenticationRoute, loginRoute } from "@/app/config/routes";

const PUBLIC_AUTH_PREFIXES = ["/forgot-password", "/reset-password"];

function isOnPublicAuthPage(pathname: string): boolean {
  return (
    isAuthenticationRoute(pathname) ||
    PUBLIC_AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

export function redirectToLoginOnExpiredSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (isOnPublicAuthPage(window.location.pathname)) {
    return;
  }

  window.location.assign(loginRoute);
}

export function resolveSafeRedirectPath(
  target: string | null,
  fallback: string,
): string {
  if (
    !target ||
    !target.startsWith("/") ||
    target.startsWith("//") ||
    target.includes("\\")
  ) {
    return fallback;
  }

  return target;
}
