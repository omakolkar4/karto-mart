/**
 * Seed script — populates the database with products from the static data file.
 * Run with: bun run scripts/seed.ts
 *
 * Also creates a default admin user:
 *   email: admin@karto.shop
 *   password: admin123
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// Import the product definitions. We need to compile the TS path alias.
// Use a direct require with the compiled path alias resolution.
const productsData = require("../src/data/products") as typeof import("../src/data/products");

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create admin user
  const adminEmail = "admin@karto.shop";
  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await hash("admin123", 10);
    await db.user.create({
      data: {
        email: adminEmail,
        name: "Karto Admin",
        phone: "9876543210",
        passwordHash,
        role: "admin",
      },
    });
    console.log("  ✓ Created admin user: admin@karto.shop / admin123");
  } else {
    console.log("  • Admin user already exists");
  }

  // 2. Seed products
  const existingCount = await db.product.count();
  if (existingCount > 0) {
    console.log(`  • Products already seeded (${existingCount} found), skipping`);
  } else {
    // The products array has been built with images assigned.
    for (const p of productsData.products) {
      await db.product.create({
        data: {
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          mrp: p.mrp,
          rating: p.rating,
          reviews: p.reviews,
          deliveryMins: p.deliveryMins,
          inStock: p.inStock,
          stockCount: p.stockCount,
          unit: p.unit,
          emoji: p.emoji,
          gradient: p.gradient,
          description: p.description,
          tags: (p.tags || []).join(","),
          image: p.image || null,
          isNew: !!p.isNew,
          isBestSeller: !!p.isBestSeller,
          isFlashSale: !!p.isFlashSale,
          isFeatured: !!p.isFeatured,
        },
      });
    }
    console.log(`  ✓ Seeded ${productsData.products.length} products`);
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
