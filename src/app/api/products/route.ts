import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** GET /api/products — list all products, optionally filtered by category. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const products = await db.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "asc" },
  });

  const result = products.map((p) => ({
    ...p,
    tags: p.tags ? p.tags.split(",").filter(Boolean) : [],
  }));

  return NextResponse.json({ products: result });
}

/** POST /api/products — create a product (admin only). */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, brand, category, price, mrp, unit, emoji, gradient, description, image, stockCount, inStock, isBestSeller, isNew, isFlashSale, isFeatured, tags } = body;
  if (!name || !brand || !category || price == null || mrp == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const product = await db.product.create({
    data: {
      name, brand, category,
      price: Number(price), mrp: Number(mrp),
      unit: unit || "1 pc", emoji: emoji || "📦",
      gradient: gradient || "from-muted to-muted/50",
      description: description || "",
      image: image || null,
      stockCount: stockCount != null ? Number(stockCount) : 50,
      inStock: inStock !== false,
      isBestSeller: !!isBestSeller, isNew: !!isNew, isFlashSale: !!isFlashSale, isFeatured: !!isFeatured,
      tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
    },
  });
  return NextResponse.json({ product: { ...product, tags: product.tags ? product.tags.split(",") : [] } }, { status: 201 });
}
