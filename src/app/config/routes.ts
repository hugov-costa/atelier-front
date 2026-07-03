export const authenticationRoutes = ["/login", "/register"] as const;

export const protectedRoutes = [
  "/",
  "/users",
  "/account",
  "/audits",
  "/verify-email",
] as const;

export const defaultAuthenticatedRoute = "/users";

export const loginRoute = "/login";

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function isAuthenticationRoute(pathname: string): boolean {
  return authenticationRoutes.some((route) => matchesRoute(pathname, route));
}

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => matchesRoute(pathname, route));
}
