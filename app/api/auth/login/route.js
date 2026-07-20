import { NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();

  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    return NextResponse.json(
      { error: "Server missing ADMIN_PASSWORD env var" },
      { status: 500 }
    );
  }

  if (username !== expectedUser || password !== expectedPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAdminToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
