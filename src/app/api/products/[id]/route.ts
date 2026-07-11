import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** GET /api/products/[id] — get a single product. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product: { ...product, tags: product.tags ? product.tags.split(",").filter(Boolean) : [] } });
}

/** PUT /api/products/[id] — update a product (admin only). */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  // Build update data from allowed fields
  const allowed = ["name", "brand", "category", "price", "mrp", "rating", "reviews", "deliveryMins", "inStock", "stockCount", "unit", "emoji", "gradient", "description", "image", "isNew", "isBestSeller", "isFlashSale", "isFeatured", "tags"];
  const data: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) {
      if (k === "tags") data[k] = Array.isArray(body[k]) ? body[k].join(",") : body[k];
      else if (["price", "mrp", "rating"].includes(k)) data[k] = Number(body[k]);
      else if (["reviews", "deliveryMins", "stockCount"].includes(k)) data[k] = Number(body[k]);
      else if (["inStock", "isNew", "isBestSeller", "isFlashSale", "isFeatured"].includes(k)) data[k] = !!body[k];
      else data[k] = body[k];
    }
  }
  const product = await db.product.update({ where: { id }, data });
  return NextResponse.json({ product: { ...product, tags: product.tags ? product.tags.split(",").filter(Boolean) : [] } });
}

/** DELETE /api/products/[id] — delete a product (admin only). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
