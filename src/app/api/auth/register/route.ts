import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

/** POST /api/auth/register — create a new user account with real credentials. */
export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }
  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email: email.toLowerCase(), phone: phone || null, passwordHash, role: "user" },
  });
  await setSessionCookie(user.id);
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  }, { status: 201 });
}
