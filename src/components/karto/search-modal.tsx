"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Star } from "lucide-react";
import { useStore } from "@/components/karto/store";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/karto/product-card";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

export function SearchModal() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const openProduct = useStore((s) => s.openProduct);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset filters when the modal closes. setState-in-effect is acceptable here
      // because it synchronizes local UI state with the open/close lifecycle.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ(""); setCat(null); setBrand(null); setMaxPrice(2000); setMinRating(0); setSort("popular"); setShowFilters(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), []);

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return Array.from(new Set(
      products.filter((p) => p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower) || p.tags.some((t) => t.includes(lower)))
        .map((p) => p.name)
    )).slice(0, 6);
  }, [q]);

  const results = useMemo(() => {
    const lower = q.toLowerCase().trim();
    let list = products.filter((p) => {
      if (lower && !(p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower) || p.tags.some((t) => t.includes(lower)))) return false;
      if (cat && p.category !== cat) return false;
      if (brand && p.brand !== brand) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    if (sort === "price-asc") list = list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    else list = list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [q, cat, brand, maxPrice, minRating, sort]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/60 p-0 backdrop-blur-sm sm:p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-4xl flex-col bg-background sm:h-auto sm:max-h-[88vh] sm:rounded-2xl sm:shadow-2xl"
          >
            {/* search bar */}
            <div className="flex items-center gap-2 border-b border-border p-3 sm:p-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); analytics.search(e.target.value); }}
                placeholder="Search for products, brands and more..."
                className="h-10 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={cn("flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold transition", showFilters && "border-karto-green text-karto-green")}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden">
              {/* filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden w-60 shrink-0 overflow-y-auto border-r border-border p-4 sm:block"
                  >
                    <FilterContent
                      cat={cat} setCat={setCat}
                      brand={brand} setBrand={setBrand}
                      allBrands={allBrands}
                      maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                      minRating={minRating} setMinRating={setMinRating}
                      sort={sort} setSort={setSort}
                    />
                  </motion.aside>
                )}
              </AnimatePresence>

              {/* results */}
              <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                {q.trim() === "" && suggestions.length === 0 ? (
                  <div className="p-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {["Milk", "Banana", "Bread", "Chips", "Chocolate", "Coffee", "Diapers", "Onion", "Tomato", "Eggs"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setQ(s)}
                          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition hover:border-karto-green hover:text-karto-green"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-muted-foreground">Trending products</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {products.filter((p) => p.isBestSeller).slice(0, 6).map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
                      <span><span className="font-bold text-foreground">{results.length}</span> results{q && <> for &ldquo;<span className="font-semibold text-foreground">{q}</span>&rdquo;</>}</span>
                      <div className="flex gap-1.5">
                        {suggestions.slice(0, 3).map((s) => (
                          <button key={s} onClick={() => setQ(s)} className="rounded-full bg-muted px-2 py-0.5 text-[11px] hover:bg-karto-green/10 hover:text-karto-green">{s}</button>
                        ))}
                      </div>
                    </div>
                    {/* mobile filters */}
                    {showFilters && (
                      <div className="border-b border-border p-4 sm:hidden">
                        <FilterContent
                          cat={cat} setCat={setCat}
                          brand={brand} setBrand={setBrand}
                          allBrands={allBrands}
                          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                          minRating={minRating} setMinRating={setMinRating}
                          sort={sort} setSort={setSort}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <p className="text-5xl">🔍</p>
                          <p className="mt-3 font-semibold">No products found</p>
                          <p className="mt-1 text-sm text-muted-foreground">Try a different keyword or adjust filters.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {results.slice(0, 40).map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FilterContent({
  cat, setCat, brand, setBrand, allBrands, maxPrice, setMaxPrice, minRating, setMinRating, sort, setSort,
}: {
  cat: string | null; setCat: (c: string | null) => void;
  brand: string | null; setBrand: (b: string | null) => void; allBrands: string[];
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
    <div className="space-y-5">
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
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</p>
        <div className="space-y-1">
          <button onClick={() => setCat(null)} className={cn("flex w-full rounded-lg px-2.5 py-1.5 text-left text-sm", !cat ? "bg-karto-green/10 font-semibold text-karto-green" : "hover:bg-muted")}>All</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm", cat === c.id ? "bg-karto-green/10 font-semibold text-karto-green" : "hover:bg-muted")}>
              <span>{c.emoji}</span> {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Brand</p>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {allBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-muted">
              <input type="radio" name="sbrand" checked={brand === b} onChange={() => setBrand(brand === b ? null : b)} className="accent-[var(--karto-green)]" />
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
