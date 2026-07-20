import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);
const COOKIE_NAME = "collei_admin_session";

async function isAuthed(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload?.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApiWrite =
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (isAdminPage || isAdminApiWrite) {
    const authed = await isAuthed(req);
    if (!authed) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};
