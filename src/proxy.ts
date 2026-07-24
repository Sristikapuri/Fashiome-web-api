import { NextResponse, NextRequest } from "next/server";
import { getTokenCookie, getUserData } from "./lib/cookies";

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const adminRoutes = ["/admin", "/dashboard/admin"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Server Actions are POST requests to the current page. Let Next.js handle
  // them before applying page-navigation redirects; otherwise an expired
  // session gets redirected to the HTML login page and the client reports a
  // generic "unexpected response" error instead of receiving the action's
  // serialized result.
  const isServerActionRequest =
    request.method === "POST" && request.headers.has("next-action");
  if (isServerActionRequest) {
    return NextResponse.next();
  }

  const clear = request.nextUrl.searchParams.get("clear") === "true";
  if (clear) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_data");
    return response;
  }

  const token = await getTokenCookie();
  const user = await getUserData();

  const isPublicRoute = publicRoutes.some((route) => matchesRoute(pathname, route));
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdminRoute = adminRoutes.some((route) => matchesRoute(pathname, route));
  if (token && user) {
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (token && isPublicRoute) {
    const destination = user?.role === "admin" ? "/dashboard/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/register",
    "/dashboard",
    "/dashboard/:path*",
    "/dashboard/admin/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/silhouette",
    "/silhouette/:path*",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/admin/:path*",
  ]
}
