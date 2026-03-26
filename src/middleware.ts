import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

const protectedRoutes = ["/doctor", "/corporation", "/consultant", "/admin"];
const authRoutes = ["/login", "/register"];

const roleRoutes: Record<string, string[]> = {
  DOCTOR: ["/doctor"],
  CORPORATION: ["/corporation"],
  CONSULTANT: ["/consultant", "/doctor", "/corporation"],
  ADMIN: ["/admin", "/consultant", "/doctor", "/corporation"],
};

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

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // JWTトークンを直接デコード（NextAuthのauth()を使わない軽量方式）
  const token = await decode({
    token: req.cookies.get("authjs.session-token")?.value
      ?? req.cookies.get("__Secure-authjs.session-token")?.value,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "",
    salt: req.cookies.get("__Secure-authjs.session-token")?.value
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // ログイン済みユーザーが認証ページにアクセス → ダッシュボードへリダイレクト
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL(getDashboardUrlForRole(userRole), nextUrl));
  }

  // 未ログインで保護ルートにアクセス → ログインページへリダイレクト
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // ロールベースのアクセス制御
  if (isProtectedRoute && isLoggedIn && userRole) {
    const allowedPrefixes = roleRoutes[userRole] || [];
    const hasAccess = allowedPrefixes.some((prefix) =>
      nextUrl.pathname.startsWith(prefix)
    );

    if (!hasAccess) {
      return NextResponse.redirect(new URL(getDashboardUrlForRole(userRole), nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)$",
  ],
};
