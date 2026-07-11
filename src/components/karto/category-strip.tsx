"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { useStore } from "@/components/karto/store";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CategoryStrip() {
  const navigateToCategory = useStore((s) => s.navigateToCategory);

  const handle = (id: string) => {
    navigateToCategory(id);
    analytics.categoryClick(id);
  };

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">Shop by category</p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">What&apos;s on your list today?</h2>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-15">
        {categories.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.3) }}
            whileHover={{ y: -3 }}
            onClick={() => handle(c.id)}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className={cn(
                "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br transition group-hover:shadow-md",
                c.gradient,
                "border-border"
              )}
            >
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
              ) : (
                <span className="text-2xl transition group-hover:scale-110 sm:text-3xl">{c.emoji}</span>
              )}
            </span>
            <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight sm:text-xs">{c.name}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
