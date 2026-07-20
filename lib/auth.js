import jwt from "jsonwebtoken";

const COOKIE_NAME = "collei_admin_session";
const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signAdminToken(username) {
  return jwt.sign({ role: "admin", username }, SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token) {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload?.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
