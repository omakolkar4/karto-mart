"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, ShoppingCart, Zap, Minus, Plus, Star, Truck, ShieldCheck, RotateCcw,
  Check, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/components/karto/store";
import { getProductById, getRelatedProducts, getFrequentlyBought, discountPct } from "@/data/products";
import { reviews as allReviews } from "@/data/extras";
import { ProductImage, Stars, QuantitySelector } from "@/components/karto/primitives";
import { formatPrice, estimatedDelivery } from "@/lib/format";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ProductModal() {
  const id = useStore((s) => s.productModalId);
  const setId = useStore((s) => s.openProduct);
  const cartQty = useStore((s) => (id ? s.cart.find((i) => i.productId === id)?.qty ?? 0 : 0));
  const addToCart = useStore((s) => s.addToCart);
  const incQty = useStore((s) => s.incQty);
  const decQty = useStore((s) => s.decQty);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setCheckoutOpen = useStore((s) => s.setCheckoutOpen);
  const user = useStore((s) => s.user);
  const setAuthOpen = useStore((s) => s.setAuthOpen);

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");

  const product = id ? getProductById(id) : null;
  const related = useMemo(() => (product ? getRelatedProducts(product, 6) : []), [product]);
  const fbt = useMemo(() => (product ? getFrequentlyBought(product, 3) : []), [product, id]);

  const [fbtSelected, setFbtSelected] = useState<Record<string, boolean>>({});
  const close = () => setId(null);

  const buyNow = () => {
    if (!product) return;
    addToCart(product, qty);
    analytics.addToCart(product.id, product.price);
    close();
    if (!user) { setAuthOpen(true); toast.info("Please login to checkout"); return; }
    setCheckoutOpen(true);
  };

  const addAllFbt = () => {
    if (!product) return;
    addToCart(product, qty);
    fbt.filter((p) => fbtSelected[p.id]).forEach((p) => addToCart(p, 1));
    analytics.addToCart(product.id, product.price);
    toast.success("Added bundle to cart");
    close();
    setCartOpen(true);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="my-0 w-full max-w-5xl bg-background sm:my-4 sm:rounded-2xl sm:shadow-2xl"
          >
            {/* close */}
            <button onClick={close} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur transition hover:bg-muted" aria-label="Close">
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-0 md:grid-cols-2">
              {/* gallery */}
              <div className="relative">
                <div className="relative aspect-square w-full md:aspect-auto md:h-full md:min-h-[440px]">
                  <ProductImage emoji={product.emoji} gradient={product.gradient} size="xl" className="h-full w-full" />
                  {discountPct(product) > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-karto-green px-3 py-1 text-xs font-bold text-white shadow">
                      {discountPct(product)}% OFF
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">BESTSELLER</span>
                  )}
                </div>
                {/* thumbnail strip (decorative variations) */}
                <div className="flex gap-2 p-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-14 w-14 overflow-hidden rounded-lg border-2 bg-gradient-to-br", product.gradient, i === 0 ? "border-karto-green" : "border-transparent opacity-70")}>
                      <div className="flex h-full w-full items-center justify-center text-2xl">{product.emoji}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* details */}
              <div className="flex flex-col p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
                <h1 className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">{product.name}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Stars rating={product.rating} size={16} showValue reviews={product.reviews} />
                  <button onClick={() => setTab("reviews")} className="text-xs font-semibold text-karto-green hover:underline">Read reviews</button>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-3xl font-black">{formatPrice(product.price)}</span>
                  {product.mrp > product.price && <span className="mb-1 text-base text-muted-foreground line-through">{formatPrice(product.mrp)}</span>}
                  {discountPct(product) > 0 && (
                    <span className="mb-1 rounded-md bg-karto-green/10 px-2 py-0.5 text-xs font-bold text-karto-green">Save {formatPrice(product.mrp - product.price)}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · {product.unit}</p>

                {/* delivery + stock */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <Truck className="h-4 w-4 text-karto-green" />
                    <div><p className="font-semibold">Delivery</p><p className="text-muted-foreground">{estimatedDelivery(product.deliveryMins)}</p></div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    {product.inStock ? <Check className="h-4 w-4 text-karto-green" /> : <X className="h-4 w-4 text-red-500" />}
                    <div><p className="font-semibold">Stock</p><p className="text-muted-foreground">{product.inStock ? `${product.stockCount} left` : "Out of stock"}</p></div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <ShieldCheck className="h-4 w-4 text-karto-green" />
                    <div><p className="font-semibold">Quality</p><p className="text-muted-foreground">100% fresh</p></div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <RotateCcw className="h-4 w-4 text-karto-green" />
                    <div><p className="font-semibold">Returns</p><p className="text-muted-foreground">Easy returns</p></div>
                  </div>
                </div>

                {/* quantity + actions */}
                <div className="mt-5 flex items-center gap-3">
                  <QuantitySelector qty={cartQty > 0 ? cartQty : qty} onInc={() => (cartQty > 0 ? incQty(product.id) : setQty((q) => q + 1))} onDec={() => (cartQty > 0 ? decQty(product.id) : setQty((q) => Math.max(1, q - 1)))} />
                  <span className="text-sm text-muted-foreground">{cartQty > 0 ? `${cartQty} in cart` : ""}</span>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => { addToCart(product, qty); analytics.addToCart(product.id, product.price); toast.success("Added to cart", { description: product.name }); }}
                    disabled={!product.inStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-karto-green py-3 text-sm font-bold text-karto-green transition hover:bg-karto-green/10 disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                  <button
                    onClick={buyNow}
                    disabled={!product.inStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-karto-green py-3 text-sm font-bold text-white transition hover:bg-karto-green/90 disabled:opacity-50"
                  >
                    <Zap className="h-4 w-4 fill-white" /> Buy Now
                  </button>
                  <button
                    onClick={() => { toggleWishlist(product.id); if (!wishlist.includes(product.id)) { analytics.wishlist(product.id); toast.success("Added to wishlist"); } }}
                    className={cn("flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-red-400", wishlist.includes(product.id) ? "text-red-500" : "text-muted-foreground")}
                    aria-label="Wishlist"
                  >
                    <Heart className={cn("h-5 w-5", wishlist.includes(product.id) && "fill-red-500")} />
                  </button>
                </div>

                {/* tabs */}
                <div className="mt-6 border-b border-border">
                  <div className="flex gap-1">
                    {([["desc", "Description"], ["specs", "Specifications"], ["reviews", `Reviews (${product.reviews})`]] as const).map(([t, l]) => (
                      <button key={t} onClick={() => setTab(t)} className={cn("relative px-3 py-2 text-sm font-semibold transition", tab === t ? "text-karto-green" : "text-muted-foreground hover:text-foreground")}>
                        {l}
                        {tab === t && <motion.span layoutId="pmtab" className="absolute inset-x-0 -bottom-px h-0.5 bg-karto-green" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tab === "desc" && <p>{product.description} Sourced and packed fresh by Karto&apos;s quality team to ensure you get the best. Store as per instructions and consume within the mentioned timeframe for optimal freshness.</p>}
                  {tab === "specs" && (
                    <ul className="space-y-1.5">
                      {[["Brand", product.brand], ["Category", product.category], ["Unit", product.unit], ["Delivery time", `${product.deliveryMins} mins`], ["Storage", "Keep in cool dry place"], ["Country of origin", "India"], ["SKU", product.id.toUpperCase()]].map(([k, v]) => (
                        <li key={k} className="flex justify-between border-b border-dashed border-border pb-1.5"><span className="font-medium text-foreground">{k}</span><span className="capitalize">{v}</span></li>
                      ))}
                    </ul>
                  )}
                  {tab === "reviews" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                        <span className="text-3xl font-black">{product.rating.toFixed(1)}</span>
                        <div><Stars rating={product.rating} size={14} /><p className="mt-0.5 text-xs text-muted-foreground">{product.reviews.toLocaleString("en-IN")} ratings</p></div>
                      </div>
                      {allReviews.slice(0, 3).map((r) => (
                        <div key={r.id} className="border-b border-border pb-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{r.name}</span>
                            <Stars rating={r.rating} size={12} />
                          </div>
                          <p className="mt-1 text-xs">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Frequently bought together */}
            {fbt.length > 0 && (
              <div className="border-t border-border p-5 sm:p-6">
                <h3 className="mb-3 text-lg font-bold">Frequently bought together</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-karto-green bg-gradient-to-br text-3xl shadow-sm" >
                      <span className={cn("flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br", product.gradient)}>{product.emoji}</span>
                    </div>
                    {fbt.map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <span className="text-muted-foreground">+</span>
                        <button
                          onClick={() => setFbtSelected((s) => ({ ...s, [p.id]: !s[p.id] }))}
                          className={cn("flex h-16 w-16 items-center justify-center rounded-xl border-2 bg-gradient-to-br text-3xl transition", p.gradient, fbtSelected[p.id] ? "border-karto-green" : "border-transparent opacity-70")}
                        >
                          {p.emoji}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">Total for selected</p>
                    <p className="text-xl font-black text-karto-green">
                      {formatPrice(product.price * qty + fbt.filter((p) => fbtSelected[p.id]).reduce((s, p) => s + p.price, 0))}
                    </p>
                    <button onClick={addAllFbt} className="mt-1 flex items-center gap-1 rounded-full bg-karto-green px-4 py-2 text-xs font-bold text-white hover:bg-karto-green/90">
                      Add all to cart <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Related products */}
            {related.length > 0 && (
              <div className="border-t border-border p-5 sm:p-6">
                <h3 className="mb-3 text-lg font-bold">Related products</h3>
                <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
                  {related.map((p) => (
                    <button key={p.id} onClick={() => { setId(p.id); setTab("desc"); }} className="w-36 shrink-0 rounded-xl border border-border bg-card p-2 text-left transition hover:border-karto-green/40 hover:shadow-sm">
                      <ProductImage emoji={p.emoji} gradient={p.gradient} size="sm" className="mb-2 h-20 w-full rounded-lg" />
                      <p className="line-clamp-1 text-xs font-semibold">{p.name}</p>
                      <p className="text-xs font-bold text-karto-green">{formatPrice(p.price)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
