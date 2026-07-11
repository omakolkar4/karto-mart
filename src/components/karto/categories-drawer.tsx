"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Home, LayoutGrid } from "lucide-react";
import { useStore } from "@/components/karto/store";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export function CategoriesDrawer() {
  const open = useStore((s) => s.categoriesDrawerOpen);
  const setOpen = useStore((s) => s.setCategoriesDrawerOpen);
  const navigateToCategory = useStore((s) => s.navigateToCategory);
  const navigateHome = useStore((s) => s.navigateHome);
  const activeCategory = useStore((s) => s.activeCategory);
  const view = useStore((s) => s.view);

  const handleCategory = (id: string) => {
    navigateToCategory(id);
    setOpen(false);
  };

  const handleHome = () => {
    navigateHome();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed left-0 top-0 z-[81] flex h-full w-80 flex-col bg-background shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-karto-green to-emerald-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" />
                <h2 className="text-lg font-bold">All Categories</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-white/15" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto p-3">
              <button
                onClick={handleHome}
                className={cn(
                  "mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                  view === "home" ? "bg-karto-green/10 text-karto-green" : "hover:bg-muted"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-karto-green/10 text-karto-green">
                  <Home className="h-5 w-5" />
                </span>
                Home
              </button>

              <div className="grid grid-cols-1 gap-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategory(c.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      activeCategory === c.id ? "bg-karto-green/10 text-karto-green" : "hover:bg-muted"
                    )}
                  >
                    <span className={cn("flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-lg", c.gradient)}>
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        c.emoji
                      )}
                    </span>
                    <span className="flex-1 text-left">{c.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className="border-t border-border p-3 text-center text-xs text-muted-foreground">
              {categories.length} categories · 100+ products
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
