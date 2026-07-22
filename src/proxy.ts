import { NextResponse, NextRequest } from "next/server";
import { getTokenCookie, getUserData } from "./lib/cookies";

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const adminRoutes = ["/admin", "/dashboard/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const clear = request.nextUrl.searchParams.get("clear") === "true";
  if (clear) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_data");
    return response;
  }

  const token = await getTokenCookie();
  const user = await getUserData();

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
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
    "/dashboard/admin/:path*",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/admin/:path*",
  ]
}
