"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useStore } from "@/components/karto/store";
import { discountPct, type Product } from "@/data/products";
import { useProductsStore } from "@/lib/products-store";
import { ProductImage, Stars } from "@/components/karto/primitives";
import { formatPrice } from "@/lib/format";
import { analytics } from "@/lib/analytics";

export function WishlistDrawer() {
  const open = useStore((s) => s.wishlistOpen);
  const setOpen = useStore((s) => s.setWishlistOpen);
  const wishlist = useStore((s) => s.wishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const wishlistToCart = useStore((s) => s.wishlistToCart);
  const openProduct = useStore((s) => s.openProduct);
  const productMap = useProductsStore((s) => s.productMap);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-bold">Wishlist</h2>
                {wishlist.length > 0 && (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-500">{wishlist.length}</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-5xl">💝</div>
                <div>
                  <p className="text-lg font-bold">Your wishlist is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it for later.</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-karto-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90"
                >
                  Browse products
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {wishlist.map((id) => {
                    const p = productMap[id];
                    if (!p) return null;
                    const pct = discountPct(p);
                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                      >
                        <button
                          onClick={() => { openProduct(p.id); setOpen(false); }}
                          className="shrink-0"
                          aria-label="View product"
                        >
                          <ProductImage image={p.image} emoji={p.emoji} gradient={p.gradient} size="sm" className="h-16 w-16 rounded-xl" />
                        </button>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between">
                            <button onClick={() => { openProduct(p.id); setOpen(false); }} className="text-left">
                              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.brand}</p>
                              <h4 className="line-clamp-1 text-sm font-semibold">{p.name}</h4>
                              <p className="text-xs text-muted-foreground">{p.unit}</p>
                            </button>
                            <button
                              onClick={() => { removeFromWishlist(id); toast("Removed from wishlist", { description: p.name }); }}
                              className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-500"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-1"><Stars rating={p.rating} size={11} /></div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                              {pct > 0 && <span className="text-xs text-muted-foreground line-through">{formatPrice(p.mrp)}</span>}
                            </div>
                            <button
                              onClick={() => { wishlistToCart(id); analytics.addToCart(id, p.price); toast.success("Moved to cart", { description: p.name }); }}
                              disabled={!p.inStock}
                              className="flex items-center gap-1.5 rounded-full bg-karto-green px-3 py-1.5 text-xs font-bold text-white transition hover:bg-karto-green/90 disabled:opacity-50"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> {p.inStock ? "Add" : "Out"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
