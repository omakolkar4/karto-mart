"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { useStore } from "@/components/karto/store";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CategoryStrip() {
  const selectedCategory = useStore((s) => s.selectedCategory);
  const setSelectedCategory = useStore((s) => s.setSelectedCategory);

  const handle = (id: string) => {
    setSelectedCategory(selectedCategory === id ? null : id);
    analytics.categoryClick(id);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">Shop by category</p>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">What are you looking for?</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
        {categories.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            whileHover={{ y: -4 }}
            onClick={() => handle(c.id)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center transition",
              selectedCategory === c.id
                ? "border-karto-green karto-shadow-green"
                : "border-border hover:border-karto-green/40 hover:shadow-sm"
            )}
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl transition group-hover:scale-110",
                c.gradient
              )}
            >
              {c.emoji}
            </span>
            <span className="line-clamp-2 text-xs font-semibold leading-tight">{c.name}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
