"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useProductsStore } from "@/lib/products-store";
import { categories, categoryMap } from "@/data/categories";
import { brands } from "@/data/products";
import { useStore } from "@/components/karto/store";
import { ProductCard } from "@/components/karto/product-card";
import { cn } from "@/lib/utils";

type Sort = "newest" | "popular" | "price-asc" | "price-desc" | "rating";

export function Catalog() {
  const selectedCategory = useStore((s) => s.selectedCategory);
  const setSelectedCategory = useStore((s) => s.setSelectedCategory);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const products = useProductsStore((s) => s.products);

  const [sort, setSort] = useState<Sort>("popular");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(24);

  const categoryBrands = useMemo(() => {
    const set = new Set(
      products.filter((p) => !selectedCategory || p.category === selectedCategory).map((p) => p.brand)
    );
    return Array.from(set);
  }, [selectedCategory, products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (brandFilter && p.brand !== brandFilter) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    switch (sort) {
      case "newest":
        list = list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
      case "popular":
        list = list.sort((a, b) => b.reviews - a.reviews);
        break;
      case "price-asc":
        list = list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [selectedCategory, brandFilter, maxPrice, minRating, sort, products]);

  const activeCat = selectedCategory ? categoryMap[selectedCategory] : null;
  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const sortOptions: { id: Sort; label: string }[] = [
    { id: "popular", label: "Popularity" },
    { id: "newest", label: "Newest" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "rating", label: "Highest Rated" },
  ];

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">
            {activeCat ? activeCat.emoji + " " + activeCat.name : "All products"}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {activeCat ? activeCat.description : "Explore our catalog"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products available</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold transition hover:border-karto-green/50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {sortOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => setSort(o.id)}
                className={cn(
                  "rounded-full px-2.5 py-1.5 text-xs font-semibold transition",
                  sort === o.id ? "bg-karto-green text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {o.label}
              </button>
            )).slice(0, 3)}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full bg-transparent px-2 py-1.5 text-xs font-semibold text-muted-foreground outline-none"
              aria-label="Sort"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* filters sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterPanel
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoryBrands={categoryBrands}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
          />
        </aside>

        {/* mobile filter drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 z-[71] max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-background p-5 lg:hidden"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="rounded-lg p-2 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterPanel
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categoryBrands={categoryBrands}
                  brandFilter={brandFilter}
                  setBrandFilter={setBrandFilter}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  minRating={minRating}
                  setMinRating={setMinRating}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* product grid */}
        <div className="flex-1">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 text-lg font-semibold">No products match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting filters or search for something else.</p>
              <button
                onClick={() => setSearchOpen(true)}
                className="mt-4 rounded-full bg-karto-green px-5 py-2.5 text-sm font-bold text-white"
              >
                Search products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {shown.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + 24)}
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold transition hover:border-karto-green hover:text-karto-green"
              >
                Load more products
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  categoryBrands,
  brandFilter,
  setBrandFilter,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
}: {
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  categoryBrands: string[];
  brandFilter: string | null;
  setBrandFilter: (b: string | null) => void;
  maxPrice: number;
  setMaxPrice: (n: number) => void;
  minRating: number;
  setMinRating: (n: number) => void;
}) {
  const reset = () => {
    setSelectedCategory(null);
    setBrandFilter(null);
    setMaxPrice(2000);
    setMinRating(0);
  };
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold">Categories</h3>
          <button onClick={reset} className="text-xs font-semibold text-karto-green hover:underline">Reset</button>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition",
              !selectedCategory ? "bg-karto-green/10 font-semibold text-karto-green" : "hover:bg-muted"
            )}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition",
                selectedCategory === c.id ? "bg-karto-green/10 font-semibold text-karto-green" : "hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-2"><span>{c.emoji}</span> {c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold">Brand</h3>
        <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
          {categoryBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
              <input
                type="radio"
                name="brand"
                checked={brandFilter === b}
                onChange={() => setBrandFilter(brandFilter === b ? null : b)}
                className="accent-[var(--karto-green)]"
              />
              {b}
            </label>
          ))}
          {brandFilter && (
            <button onClick={() => setBrandFilter(null)} className="mt-1 text-xs font-semibold text-karto-green hover:underline">
              Clear brand
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold">Max Price: ₹{maxPrice}</h3>
        <input
          type="range"
          min={20}
          max={2000}
          step={20}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--karto-green)]"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹20</span><span>₹2000</span>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold">Minimum Rating</h3>
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition",
                minRating === r ? "border-karto-green bg-karto-green/10 text-karto-green" : "border-border hover:bg-muted"
              )}
            >
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
