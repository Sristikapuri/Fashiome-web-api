import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const adminRoutes = ["/admin", "/dashboard/admin"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;


  const isServerActionRequest =
    request.method === "POST" && request.headers.has("next-action");
  if (isServerActionRequest) {
    return NextResponse.next();
  }

  const clear = request.nextUrl.searchParams.get("clear") === "true";
  if (clear) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete({ name: "auth_token", path: "/" });
    response.cookies.delete({ name: "user_data", path: "/" });
    return response;
  }

  const token = request.cookies.get("auth_token")?.value;
  const userDataCookie = request.cookies.get("user_data")?.value;
  let user = null;
  try {
    user = userDataCookie ? JSON.parse(userDataCookie) : null;
  } catch {
    user = null;
  }

  if (token && !user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete({ name: "auth_token", path: "/" });
    response.cookies.delete({ name: "user_data", path: "/" });
    return response;
  }

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
    "/silhouette",
    "/silhouette/:path*",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/admin/:path*",
  ]
}
