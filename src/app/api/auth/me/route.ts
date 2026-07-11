import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

/** GET /api/auth/me — return the current logged-in user. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
