import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** DELETE /api/addresses/[id] — delete a saved address. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  // Ensure the address belongs to the user
  const addr = await db.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await db.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
