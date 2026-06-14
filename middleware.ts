import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const isAdminApi =
    pathname.startsWith("/api/admin/") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/logout";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const isLogged = req.cookies.get("admin_auth")?.value === "true";

  if (!isLogged) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin-login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};