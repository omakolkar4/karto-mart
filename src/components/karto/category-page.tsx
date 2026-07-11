"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, SlidersHorizontal, X, Star, Clock } from "lucide-react";
import { useStore } from "@/components/karto/store";
import { products } from "@/data/products";
import { categoryMap, categories } from "@/data/categories";
import { ProductCard } from "@/components/karto/product-card";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

export function CategoryPage() {
  const activeCategory = useStore((s) => s.activeCategory);
  const navigateHome = useStore((s) => s.navigateHome);
  const navigateToCategory = useStore((s) => s.navigateToCategory);

  const [sort, setSort] = useState<Sort>("popular");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const cat = activeCategory ? categoryMap[activeCategory] : null;

  const categoryBrands = useMemo(() => {
    return Array.from(new Set(products.filter((p) => p.category === activeCategory).map((p) => p.brand)));
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (brandFilter && p.brand !== brandFilter) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    switch (sort) {
      case "popular": list = list.sort((a, b) => b.reviews - a.reviews); break;
      case "price-asc": list = list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list = list.sort((a, b) => b.price - a.price); break;
      case "rating": list = list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [activeCategory, brandFilter, maxPrice, minRating, sort]);

  if (!cat) return null;

  const sortOptions: { id: Sort; label: string }[] = [
    { id: "popular", label: "Popularity" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "rating", label: "Highest Rated" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      {/* breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <button onClick={navigateHome} className="flex items-center gap-1 text-muted-foreground transition hover:text-karto-green">
          <ChevronLeft className="h-4 w-4" /> Home
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold text-foreground">{cat.name}</span>
      </div>

      {/* category header banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn("relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br p-6", cat.gradient)}
      >
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-5xl">{cat.emoji}</span>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{cat.name}</h1>
            <p className="text-sm text-muted-foreground">{cat.description} · {filtered.length} products</p>
          </div>
        </div>
        {cat.image && (
          <img src={cat.image} alt={cat.name} className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-20" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        )}
      </motion.div>

      {/* related categories chips */}
      <div className="hide-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {categories.filter((c) => c.id !== activeCategory).slice(0, 8).map((c) => (
          <button
            key={c.id}
            onClick={() => navigateToCategory(c.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-karto-green hover:text-karto-green"
          >
            <span>{c.emoji}</span> {c.short}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* filters sidebar (desktop) */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <FilterPanel
            categoryBrands={categoryBrands}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            sort={sort}
            setSort={setSort}
          />
        </aside>

        {/* mobile filter drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
              />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 z-[71] max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-background p-5 lg:hidden"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
                </div>
                <FilterPanel
                  categoryBrands={categoryBrands}
                  brandFilter={brandFilter}
                  setBrandFilter={setBrandFilter}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  sort={sort}
                  setSort={setSort}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* product grid */}
        <div className="flex-1">
          {/* sort bar */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> products</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold transition hover:border-karto-green/50 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold outline-none focus:border-karto-green"
              >
                {sortOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 text-lg font-semibold">No products match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  categoryBrands, brandFilter, setBrandFilter, maxPrice, setMaxPrice, minRating, setMinRating, sort, setSort,
}: {
  categoryBrands: string[];
  brandFilter: string | null; setBrandFilter: (b: string | null) => void;
  maxPrice: number; setMaxPrice: (n: number) => void;
  minRating: number; setMinRating: (n: number) => void;
  sort: Sort; setSort: (s: Sort) => void;
}) {
  const sorts: { id: Sort; label: string }[] = [
    { id: "popular", label: "Popularity" },
    { id: "price-asc", label: "Price: Low → High" },
    { id: "price-desc", label: "Price: High → Low" },
    { id: "rating", label: "Highest Rated" },
  ];
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Sort</p>
        <div className="space-y-1">
          {sorts.map((s) => (
            <button key={s.id} onClick={() => setSort(s.id)} className={cn("flex w-full rounded-lg px-2.5 py-1.5 text-left text-sm", sort === s.id ? "bg-karto-green/10 font-semibold text-karto-green" : "hover:bg-muted")}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Brand</p>
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {categoryBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-muted">
              <input type="radio" name="catbrand" checked={brandFilter === b} onChange={() => setBrandFilter(brandFilter === b ? null : b)} className="accent-[var(--karto-green)]" />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Max Price: ₹{maxPrice}</p>
        <input type="range" min={20} max={2000} step={20} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--karto-green)]" />
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Min Rating</p>
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={cn("flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold", minRating === r ? "border-karto-green bg-karto-green/10 text-karto-green" : "border-border")}>
              {r === 0 ? "Any" : <span className="flex items-center justify-center gap-0.5">{r}<Star className="h-3 w-3 fill-amber-400 text-amber-400" /></span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
