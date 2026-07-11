import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** GET /api/wishlist — list current user's wishlist product IDs. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ productIds: [] });
  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return NextResponse.json({ productIds: items.map((i) => i.productId) });
}

/** POST /api/wishlist — add a product to the wishlist. */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  await db.wishlistItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    create: { userId: user.id, productId },
    update: {},
  });
  return NextResponse.json({ success: true });
}

/** DELETE /api/wishlist — remove a product from the wishlist. */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  await db.wishlistItem.deleteMany({
    where: { userId: user.id, productId },
  });
  return NextResponse.json({ success: true });
}
