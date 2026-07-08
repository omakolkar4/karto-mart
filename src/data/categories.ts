export type Category = {
  id: string;
  name: string;
  emoji: string;
  gradient: string; // tailwind gradient classes
  description: string;
  image?: string; // real category photo URL
};

export const categories: Category[] = [
  { id: "fruits", name: "Fruits", emoji: "🍎", gradient: "from-rose-100 to-red-50 dark:from-rose-950/40 dark:to-red-950/20", description: "Farm-fresh seasonal fruits" },
  { id: "vegetables", name: "Vegetables", emoji: "🥦", gradient: "from-green-100 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/20", description: "Crunchy farm-picked veggies" },
  { id: "dairy", name: "Dairy", emoji: "🥛", gradient: "from-sky-100 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/20", description: "Fresh milk, cheese & more" },
  { id: "snacks", name: "Snacks", emoji: "🍿", gradient: "from-amber-100 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/20", description: "Crunchy munchies & chips" },
  { id: "beverages", name: "Beverages", emoji: "🥤", gradient: "from-cyan-100 to-teal-50 dark:from-cyan-950/40 dark:to-teal-950/20", description: "Juices, sodas & energy drinks" },
  { id: "bakery", name: "Bakery", emoji: "🥖", gradient: "from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20", description: "Bread, cakes & pastries" },
  { id: "personal-care", name: "Personal Care", emoji: "🧴", gradient: "from-violet-100 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/20", description: "Skincare & grooming" },
  { id: "baby-care", name: "Baby Care", emoji: "🍼", gradient: "from-pink-100 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/20", description: "Everything for little ones" },
  { id: "cleaning", name: "Cleaning Essentials", emoji: "🧽", gradient: "from-lime-100 to-green-50 dark:from-lime-950/40 dark:to-green-950/20", description: "Keep your home spotless" },
  { id: "frozen", name: "Frozen Foods", emoji: "🧊", gradient: "from-blue-100 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20", description: "Chilled & frozen favourites" },
  { id: "instant", name: "Instant Foods", emoji: "🍜", gradient: "from-red-100 to-orange-50 dark:from-red-950/40 dark:to-orange-950/20", description: "Ready in minutes" },
  { id: "medicines", name: "Medicines", emoji: "💊", gradient: "from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20", description: "OTC wellness essentials" },
  { id: "pet-care", name: "Pet Care", emoji: "🐾", gradient: "from-stone-100 to-amber-50 dark:from-stone-950/40 dark:to-amber-950/20", description: "For your furry friends" },
  { id: "electronics", name: "Electronics Accessories", emoji: "🔌", gradient: "from-slate-100 to-zinc-50 dark:from-slate-950/40 dark:to-zinc-950/20", description: "Cables, chargers & gadgets" },
  { id: "home", name: "Home Essentials", emoji: "🏠", gradient: "from-yellow-100 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/20", description: "Everyday home must-haves" },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

// Assign real category photos from the image map.
import { categoryImages } from "@/data/image-map";
for (const c of categories) {
  if (categoryImages[c.id]) c.image = categoryImages[c.id];
}
