import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Routes that require authentication
const protectedRoutes = [
  "/doctor",
  "/corporation",
  "/consultant",
  "/admin",
];

// Routes that are only accessible to unauthenticated users
const authRoutes = ["/login", "/register"];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  DOCTOR: ["/doctor"],
  CORPORATION: ["/corporation"],
  CONSULTANT: ["/consultant", "/doctor", "/corporation"], // Consultants can access doctor and corporation pages
  ADMIN: ["/admin", "/consultant", "/doctor", "/corporation"], // Admin can access all
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // If user is logged in and tries to access auth routes, redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    const dashboardUrl = getDashboardUrlForRole(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
  }

  // If route is protected and user is not logged in, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Check role-based access
  if (isProtectedRoute && isLoggedIn && userRole) {
    const allowedPrefixes = roleRoutes[userRole] || [];
    const hasAccess = allowedPrefixes.some((prefix) =>
      nextUrl.pathname.startsWith(prefix)
    );

    if (!hasAccess) {
      // Redirect to their dashboard or show 403
      const dashboardUrl = getDashboardUrlForRole(userRole);
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
  }

  return NextResponse.next();
});

function getDashboardUrlForRole(role: string | undefined): string {
  switch (role) {
    case "DOCTOR":
      return "/doctor/dashboard";
    case "CORPORATION":
      return "/corporation/dashboard";
    case "CONSULTANT":
      return "/consultant/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)$",
  ],
};
