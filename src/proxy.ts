import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES, PUBLIC_AUTH_ROUTES } from "@/lib/routes";

const matchesRoute = (pathname: string, routes: readonly string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;
  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);
  const isPublicAuthRoute = matchesRoute(pathname, PUBLIC_AUTH_ROUTES);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
