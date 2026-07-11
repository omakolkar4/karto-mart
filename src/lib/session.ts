import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_MAX_AGE, verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

/** Set the session cookie (call from a Server Action or Route Handler). */
export async function setSessionCookie(userId: string) {
  const { createSessionToken } = await import("@/lib/auth");
  const token = createSessionToken(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/** Clear the session cookie. */
export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Get the current logged-in user from the session cookie, or null. */
export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const userId = verifySessionToken(token);
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, phone: true, role: true },
  });
  return user;
}
