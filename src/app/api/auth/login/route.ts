import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

/** POST /api/auth/login — verify credentials and start a session. */
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setSessionCookie(user.id);
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
}
