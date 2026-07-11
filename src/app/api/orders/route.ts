import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { generateOrderId, computeTax, computeDelivery } from "@/lib/format";

/** GET /api/orders — list current user's order history. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ orders: [] });
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { placedAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json({ orders });
}

/** POST /api/orders — place a new order (saves to DB). */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required to place order" }, { status: 401 });

  const body = await req.json();
  const { items, address, slot, paymentMethod, paymentLabel, discount } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!address || !slot || !paymentMethod) {
    return NextResponse.json({ error: "Missing address, slot or payment method" }, { status: 400 });
  }

  // Resolve products from DB to get accurate prices & stock
  const productIds = items.map((i: { productId: string }) => i.productId);
  const dbProducts = await db.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Build order items with current DB prices
  const orderItems = items.map((i: { productId: string; qty: number }) => {
    const p = productMap.get(i.productId);
    if (!p) throw new Error(`Product ${i.productId} not found`);
    return {
      productId: p.id,
      name: p.name,
      price: p.price,
      qty: i.qty,
      emoji: p.emoji,
      gradient: p.gradient,
      unit: p.unit,
    };
  });

  const subtotal = orderItems.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
  const tax = computeTax(subtotal);
  const delivery = computeDelivery(subtotal);
  const discountVal = Number(discount) || 0;
  const total = Math.max(0, subtotal + tax + delivery - discountVal);

  // Calculate ETA from max delivery time
  const etaMins = Math.max(15, ...dbProducts.map((p) => p.deliveryMins));

  // Save address as a snapshot (also save to addresses table if new)
  const order = await db.order.create({
    data: {
      userId: user.id,
      shortId: generateOrderId(),
      subtotal, tax, delivery, discount: discountVal, total,
      addressJson: JSON.stringify(address),
      slot,
      paymentMethod,
      paymentLabel: paymentLabel || paymentMethod,
      status: "Placed",
      etaMins,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  // Decrement stock for purchased products
  for (const item of items) {
    const p = productMap.get(item.productId);
    if (p) {
      const newStock = Math.max(0, p.stockCount - item.qty);
      await db.product.update({
        where: { id: p.id },
        data: { stockCount: newStock, inStock: newStock > 0 },
      });
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}
