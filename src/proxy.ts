import { NextRequest, NextResponse } from "next/server";
import { isValidOwnerToken, OWNER_ACCESS_COOKIE_NAME } from "@/lib/adminAccess";

const PUBLIC_PATHS = new Set(["/", "/api/access"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(OWNER_ACCESS_COOKIE_NAME)?.value;
  if (isValidOwnerToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("returnTo", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|icon.webp|apple-icon.png|robots.txt).*)",
  ],
};
