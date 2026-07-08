"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Package, MapPin, Heart, LogOut, Download, RotateCcw, XCircle, CheckCircle2,
  Truck, Clock, Plus, Trash2, ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, type Order, type OrderStatus } from "@/components/karto/store";
import { productMap } from "@/data/products";
import { ProductImage } from "@/components/karto/primitives";
import { formatPrice, estimatedDeliveryDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tab = "profile" | "orders" | "addresses" | "wishlist";

const STATUS_META: Record<OrderStatus, { color: string; icon: React.ElementType }> = {
  Placed: { color: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300", icon: Clock },
  Confirmed: { color: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300", icon: CheckCircle2 },
  "Out for Delivery": { color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300", icon: Truck },
  Delivered: { color: "bg-karto-green/15 text-karto-green", icon: CheckCircle2 },
  Cancelled: { color: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300", icon: XCircle },
};

export function AccountModal() {
  const open = useStore((s) => s.accountOpen);
  const setOpen = useStore((s) => s.setAccountOpen);
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const addresses = useStore((s) => s.addresses);
  const wishlist = useStore((s) => s.wishlist);
  const removeAddress = useStore((s) => s.removeAddress);
  const cancelOrder = useStore((s) => s.cancelOrder);
  const reorder = useStore((s) => s.reorder);
  const logout = useStore((s) => s.logout);
  const wishlistToCart = useStore((s) => s.wishlistToCart);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const setAuthOpen = useStore((s) => s.setAuthOpen);

  const [tab, setTab] = useState<Tab>("orders");

  const downloadInvoice = (order: Order) => {
    const rows = order.items.map((i) => `  ${i.name} x${i.qty} = ${formatPrice(i.price * i.qty)}`).join("\n");
    const a = order.address;
    const invoice = `KARTO INVOICE\nOrder: ${order.id}\nDate: ${new Date(order.placedAt).toLocaleString("en-IN")}\n\n${a.fullName}\n${a.house}, ${a.street}, ${a.area}, ${a.city}, ${a.state} - ${a.pincode}\n\n${rows}\n\nSubtotal: ${formatPrice(order.subtotal)}\nTax: ${formatPrice(order.tax)}\nDelivery: ${formatPrice(order.delivery)}\nDiscount: ${formatPrice(order.discount)}\nTOTAL: ${formatPrice(order.total)}\nPayment: ${order.paymentLabel}`;
    const blob = new Blob([invoice], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Karto-Invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[92] flex items-start justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="my-0 w-full max-w-3xl bg-background sm:my-4 sm:rounded-2xl sm:shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-karto-green/10 text-xl font-black text-karto-green">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold leading-tight">{user?.name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            {/* tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-border px-3 sm:px-5">
              {([["orders", "Orders", Package], ["wishlist", "Wishlist", Heart], ["addresses", "Addresses", MapPin], ["profile", "Profile", User]] as const).map(([t, l, Icon]) => (
                <button key={t} onClick={() => setTab(t)} className={cn("relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm font-semibold transition", tab === t ? "text-karto-green" : "text-muted-foreground hover:text-foreground")}>
                  <Icon className="h-4 w-4" /> {l}
                  {t === "orders" && orders.length > 0 && <span className="rounded-full bg-muted px-1.5 text-[10px] font-bold">{orders.length}</span>}
                  {t === "wishlist" && wishlist.length > 0 && <span className="rounded-full bg-muted px-1.5 text-[10px] font-bold">{wishlist.length}</span>}
                  {tab === t && <motion.span layoutId="acctab" className="absolute inset-x-0 -bottom-px h-0.5 bg-karto-green" />}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
              {/* ORDERS */}
              {tab === "orders" && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <Empty icon="📦" title="No orders yet" sub="Your past orders will appear here." action={<button onClick={() => setOpen(false)} className="rounded-full bg-karto-green px-5 py-2.5 text-sm font-bold text-white">Start shopping</button>} />
                  ) : (
                    orders.map((o) => {
                      const meta = STATUS_META[o.status];
                      return (
                        <div key={o.id} className="rounded-2xl border border-border bg-card p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-bold">{o.id}</p>
                              <p className="text-xs text-muted-foreground">{new Date(o.placedAt).toLocaleString("en-IN")} · {o.items.length} items · {formatPrice(o.total)}</p>
                            </div>
                            <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", meta.color)}><meta.icon className="h-3.5 w-3.5" /> {o.status}</span>
                          </div>

                          {/* items preview */}
                          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                            {o.items.map((i) => (
                              <div key={i.productId} className="flex shrink-0 items-center gap-2 rounded-lg border border-border p-1.5 pr-2">
                                <ProductImage image={productMap[i.productId]?.image} emoji={i.emoji} gradient={i.gradient} size="sm" className="h-8 w-8 rounded-md" />
                                <div className="text-xs"><p className="line-clamp-1 font-semibold">{i.name}</p><p className="text-muted-foreground">x{i.qty}</p></div>
                              </div>
                            ))}
                          </div>

                          {/* progress (for non-cancelled) */}
                          {o.status !== "Cancelled" && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                                {["Placed", "Confirmed", "Out for Delivery", "Delivered"].map((s) => {
                                  const reached = ["Placed", "Confirmed", "Out for Delivery", "Delivered"].indexOf(o.status) >= ["Placed", "Confirmed", "Out for Delivery", "Delivered"].indexOf(s as OrderStatus);
                                  return <span key={s} className={cn(reached && "text-karto-green")}>{s}</span>;
                                })}
                              </div>
                              <div className="mt-1 h-1 rounded-full bg-muted">
                                <div className="h-full rounded-full bg-karto-green" style={{ width: `${o.status === "Delivered" ? 100 : o.status === "Out for Delivery" ? 75 : o.status === "Confirmed" ? 50 : 25}%` }} />
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground">Estimated delivery: {estimatedDeliveryDate()} · Slot: {o.slot}</p>
                            </div>
                          )}

                          {/* actions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => downloadInvoice(o)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"><Download className="h-3.5 w-3.5" /> Invoice</button>
                            <button onClick={() => { reorder(o.id); toast.success("Items added to cart"); setOpen(false); }} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"><RotateCcw className="h-3.5 w-3.5" /> Reorder</button>
                            {o.status !== "Delivered" && o.status !== "Cancelled" && (
                              <button onClick={() => { cancelOrder(o.id); toast("Order cancelled"); }} className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"><XCircle className="h-3.5 w-3.5" /> Cancel</button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* WISHLIST */}
              {tab === "wishlist" && (
                <div className="space-y-2">
                  {wishlist.length === 0 ? (
                    <Empty icon="💝" title="Your wishlist is empty" sub="Save items you love to buy them later." action={<button onClick={() => setOpen(false)} className="rounded-full bg-karto-green px-5 py-2.5 text-sm font-bold text-white">Browse products</button>} />
                  ) : (
                    wishlist.map((id) => {
                      const p = productMap[id];
                      if (!p) return null;
                      return (
                        <div key={id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                          <ProductImage image={p.image} emoji={p.emoji} gradient={p.gradient} size="sm" className="h-14 w-14 shrink-0 rounded-lg" />
                          <div className="flex-1"><p className="line-clamp-1 text-sm font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.unit}</p><p className="text-sm font-bold text-karto-green">{formatPrice(p.price)}</p></div>
                          <div className="flex gap-1">
                            <button onClick={() => { wishlistToCart(id); toast.success("Moved to cart"); }} disabled={!p.inStock} className="rounded-full bg-karto-green px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"><ShoppingCart className="h-3.5 w-3.5" /></button>
                            <button onClick={() => removeFromWishlist(id)} className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {wishlist.length > 0 && <button onClick={() => { setOpen(false); setWishlistOpen(true); }} className="mt-2 w-full rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-muted">Open full wishlist</button>}
                </div>
              )}

              {/* ADDRESSES */}
              {tab === "addresses" && (
                <div className="space-y-2">
                  {addresses.length === 0 ? (
                    <Empty icon="📍" title="No saved addresses" sub="Add an address at checkout to save it here." />
                  ) : (
                    addresses.map((a) => (
                      <div key={a.id} className="rounded-xl border border-border bg-card p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2"><span className="font-semibold">{a.fullName}</span><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">{a.type}</span></div>
                            <p className="mt-0.5 text-sm text-muted-foreground">{a.house}, {a.street}, {a.area}, {a.city}, {a.state} - {a.pincode}</p>
                            <p className="text-xs text-muted-foreground">📱 {a.phone}</p>
                          </div>
                          <button onClick={() => { removeAddress(a.id); toast("Address removed"); }} className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                  <button onClick={() => { setOpen(false); toast.info("Add a new address at checkout"); }} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground hover:border-karto-green hover:text-karto-green"><Plus className="h-4 w-4" /> Add address (at checkout)</button>
                </div>
              )}

              {/* PROFILE */}
              {tab === "profile" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-karto-green/10 text-3xl font-black text-karto-green">{user?.name?.[0]?.toUpperCase() || "U"}</div>
                    <div>
                      <p className="text-lg font-bold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      {user?.phone && <p className="text-sm text-muted-foreground">📱 {user.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Stat label="Orders" value={orders.length} />
                    <Stat label="Wishlist" value={wishlist.length} />
                    <Stat label="Addresses" value={addresses.length} />
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-sm">
                    <p className="font-semibold">Member since</p>
                    <p className="text-muted-foreground">{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                  </div>
                  <button onClick={() => { logout(); toast("Logged out"); }} className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <p className="text-2xl font-black text-karto-green">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Empty({ icon, title, sub, action }: { icon: string; title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <span className="text-5xl">{icon}</span>
      <div><p className="font-bold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{sub}</p></div>
      {action}
    </div>
  );
}
