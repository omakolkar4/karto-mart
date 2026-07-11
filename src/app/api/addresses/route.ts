import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** GET /api/addresses — list current user's saved addresses. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ addresses: [] });
  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ addresses });
}

/** POST /api/addresses — save a new address for the current user. */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const body = await req.json();
  const { fullName, phone, altPhone, house, street, area, landmark, city, state, pincode, type } = body;
  if (!fullName || !phone || !house || !street || !area || !city || !state || !pincode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const address = await db.address.create({
    data: {
      userId: user.id,
      fullName, phone, altPhone: altPhone || null,
      house, street, area, landmark: landmark || null,
      city, state, pincode,
      type: type || "Home",
    },
  });
  return NextResponse.json({ address }, { status: 201 });
}
