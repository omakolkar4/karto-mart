"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, Heart, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useStore, cartTotals } from "@/components/karto/store";
import { productMap, discountPct } from "@/data/products";
import { coupons } from "@/data/extras";
import { ProductImage } from "@/components/karto/primitives";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/format";
import { analytics } from "@/lib/analytics";
import { useHydrated } from "@/components/karto/store-provider";

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const incQty = useStore((s) => s.incQty);
  const decQty = useStore((s) => s.decQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const moveToWishlist = useStore((s) => s.moveToWishlist);
  const appliedCoupon = useStore((s) => s.appliedCoupon);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const removeCoupon = useStore((s) => s.removeCoupon);
  const setCheckoutOpen = useStore((s) => s.setCheckoutOpen);
  const user = useStore((s) => s.user);
  const setAuthOpen = useStore((s) => s.setAuthOpen);
  const totals = useStore(useShallow(cartTotals));
  const hydrated = useHydrated();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const [code, setCode] = useState("");

  const handleApply = () => {
    const c = coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
    if (!c) {
      toast.error("Invalid coupon code", { description: "Try KARTO50, FRESH100, KARTO20 or WEEKEND15" });
      return;
    }
    const ok = applyCoupon(c);
    if (ok) {
      toast.success("Coupon applied!", { description: c.title });
      setCode("");
    } else {
      toast.error("Minimum order not met", { description: `Add items worth ₹${c.minOrder}+ to use ${c.code}.` });
    }
  };

  const checkout = () => {
    if (cart.length === 0) return;
    if (!user) {
      toast.info("Please login to continue", { description: "Login is required for checkout." });
      setOpen(false);
      setAuthOpen(true);
      return;
    }
    analytics.checkoutStarted(totals.total);
    setOpen(false);
    setCheckoutOpen(true);
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-karto-green" />
                <h2 className="text-lg font-bold">Your Cart</h2>
                {hydrated && cart.length > 0 && (
                  <span className="rounded-full bg-karto-green/10 px-2 py-0.5 text-xs font-bold text-karto-green">
                    {cart.reduce((n, i) => n + i.qty, 0)} items
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-karto-green/10 text-5xl">🛒</div>
                <div>
                  <p className="text-lg font-bold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">Add some products to get started.</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-karto-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90"
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                {/* free delivery progress */}
                <div className="border-b border-border bg-karto-green/5 px-4 py-3">
                  {totals.subtotal >= FREE_DELIVERY_THRESHOLD ? (
                    <p className="flex items-center gap-2 text-xs font-semibold text-karto-green">
                      <Truck className="h-4 w-4" /> You&apos;ve unlocked FREE delivery! 🎉
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-muted-foreground">
                      Add <span className="font-bold text-karto-green">{formatPrice(FREE_DELIVERY_THRESHOLD - totals.subtotal)}</span> more for FREE delivery
                    </p>
                  )}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-karto-green/15">
                    <div
                      className="h-full rounded-full bg-karto-green transition-all"
                      style={{ width: `${Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* items */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {cart.map((item) => {
                        const p = productMap[item.productId];
                        if (!p) return null;
                        const pct = discountPct(p);
                        return (
                          <motion.div
                            key={item.productId}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                          >
                            <ProductImage emoji={p.emoji} gradient={p.gradient} size="sm" className="h-16 w-16 shrink-0 rounded-xl" />
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.brand}</p>
                                  <h4 className="line-clamp-1 text-sm font-semibold">{p.name}</h4>
                                  <p className="text-xs text-muted-foreground">{p.unit}</p>
                                </div>
                                <button
                                  onClick={() => { removeFromCart(item.productId); analytics.removeFromCart(item.productId); toast("Removed from cart", { description: p.name }); }}
                                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-500"
                                  aria-label="Remove"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-auto flex items-end justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-bold">{formatPrice(p.price * item.qty)}</span>
                                  {pct > 0 && <span className="text-xs text-muted-foreground line-through">{formatPrice(p.mrp * item.qty)}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => moveToWishlist(item.productId)}
                                    className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-karto-green/10 hover:text-karto-green"
                                    aria-label="Move to wishlist"
                                    title="Move to wishlist"
                                  >
                                    <Heart className="h-4 w-4" />
                                  </button>
                                  <div className="inline-flex items-center rounded-full border border-border">
                                    <button onClick={() => decQty(item.productId)} className="flex h-8 w-8 items-center justify-center rounded-l-full hover:text-karto-green" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                                    <span className="min-w-6 text-center text-sm font-semibold">{item.qty}</span>
                                    <button onClick={() => incQty(item.productId)} className="flex h-8 w-8 items-center justify-center rounded-r-full hover:text-karto-green" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* coupon */}
                  <div className="mt-4 rounded-2xl border border-dashed border-border p-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-karto-green" />
                          <div>
                            <p className="text-sm font-bold text-karto-green">{appliedCoupon.code} applied</p>
                            <p className="text-xs text-muted-foreground">{appliedCoupon.title} — you saved {formatPrice(totals.discount)}</p>
                          </div>
                        </div>
                        <button onClick={() => { removeCoupon(); toast("Coupon removed"); }} className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold"><Tag className="h-3.5 w-3.5 text-karto-green" /> Have a coupon?</p>
                        <div className="flex gap-2">
                          <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter code"
                            className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm uppercase outline-none focus:border-karto-green"
                          />
                          <button onClick={handleApply} className="rounded-lg bg-karto-green px-4 text-sm font-bold text-white">Apply</button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {coupons.slice(0, 3).map((c) => (
                            <button key={c.code} onClick={() => setCode(c.code)} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:border-karto-green hover:text-karto-green">
                              {c.code}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* summary */}
                <div className="border-t border-border bg-card p-4">
                  <div className="mb-3 space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatPrice(totals.subtotal)}</span></div>
                    {totals.savings > 0 && <div className="flex justify-between text-xs"><span className="text-muted-foreground">Product savings</span><span className="font-semibold text-karto-green">−{formatPrice(totals.savings)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Taxes (5%)</span><span className="font-semibold">{formatPrice(totals.tax)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-semibold">{totals.delivery === 0 ? <span className="text-karto-green">FREE</span> : formatPrice(totals.delivery)}</span></div>
                    {totals.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Coupon</span><span className="font-semibold text-karto-green">−{formatPrice(totals.discount)}</span></div>}
                  </div>
                  <div className="mb-3 flex items-center justify-between border-t border-dashed border-border pt-3">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-xl font-extrabold text-karto-green">{formatPrice(totals.total)}</span>
                  </div>
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 text-karto-green" />
                    Estimated delivery in <span className="font-semibold text-foreground">10–15 mins</span>
                  </div>
                  <button
                    onClick={checkout}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-karto-green py-3.5 text-sm font-bold text-white transition hover:bg-karto-green/90 active:scale-[0.98]"
                  >
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
