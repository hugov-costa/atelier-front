export const authenticationRoutes = ["/login"] as const;

export const protectedRoutes = [
  "/",
  "/users",
  "/account",
  "/audits",
  "/bills",
  "/clays",
  "/clay-suppliers",
  "/commission-orders",
  "/customers",
  "/enrollments",
  "/firing-cycles",
  "/glazes",
  "/glaze-suppliers",
  "/material-purchases",
  "/notifications",
  "/piece-categories",
  "/piece-charges",
  "/pieces",
  "/recurrent-classes",
  "/reports",
  "/settings",
  "/single-classes",
  "/tuition-fees",
  "/verify-email",
] as const;

export const defaultAuthenticatedRoute = "/";

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
