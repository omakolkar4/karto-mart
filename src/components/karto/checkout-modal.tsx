"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, MapPin, Clock, CreditCard, ShoppingCart, ChevronLeft, ChevronRight,
  Wallet, Smartphone, Banknote, Building2, Plus, Trash2, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useStore, cartTotals, type Address } from "@/components/karto/store";
import { useProductsStore } from "@/lib/products-store";
import { ProductImage } from "@/components/karto/primitives";
import { formatPrice, estimatedDelivery, validatePhone, validatePincode, validateCardNumber, validateExpiry, validateCvv } from "@/lib/format";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SLOTS = [
  { id: "morning", label: "Morning", time: "8 AM – 12 PM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12 PM – 4 PM", icon: "☀️" },
  { id: "evening", label: "Evening", time: "4 PM – 8 PM", icon: "🌆" },
  { id: "express", label: "Express", time: "Within 30 mins", icon: "⚡", badge: "Fastest" },
];

const PAYMENTS = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

const STEPS = ["Address", "Delivery Slot", "Payment", "Review", "Confirm"];

export function CheckoutModal() {
  const open = useStore((s) => s.checkoutOpen);
  const setOpen = useStore((s) => s.setCheckoutOpen);
  const cart = useStore((s) => s.cart);
  const totals = useStore(useShallow(cartTotals));
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const removeAddress = useStore((s) => s.removeAddress);
  const placeOrder = useStore((s) => s.placeOrder);
  const setLastOrder = useStore((s) => s.setLastOrder);
  const user = useStore((s) => s.user);
  const productMap = useProductsStore((s) => s.productMap);

  const [step, setStep] = useState(0); // 0..4
  const [selectedAddr, setSelectedAddr] = useState<string | null>(null);
  const [slot, setSlot] = useState<string>("express");
  const [payment, setPayment] = useState("cod");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [showAddrForm, setShowAddrForm] = useState(addresses.length === 0);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({ type: "Home" });
  const [placing, setPlacing] = useState(false);

  const reset = () => {
    setStep(0); setSelectedAddr(null); setSlot("express"); setPayment("cod");
    setCard({ number: "", name: "", expiry: "", cvv: "" }); setUpi("");
    setShowAddrForm(addresses.length === 0); setNewAddr({ type: "Home" }); setPlacing(false);
  };

  const close = () => { setOpen(false); setTimeout(reset, 300); };

  const saveAddress = () => {
    const a = newAddr;
    if (!a.fullName || !a.phone || !a.house || !a.street || !a.area || !a.city || !a.state || !a.pincode) {
      toast.error("Please fill all required fields"); return;
    }
    if (!validatePhone(a.phone)) { toast.error("Enter a valid 10-digit mobile number"); return; }
    if (!validatePincode(a.pincode)) { toast.error("Enter a valid 6-digit pincode"); return; }
    const addr: Address = {
      id: "addr_" + Date.now(),
      fullName: a.fullName, phone: a.phone, altPhone: a.altPhone,
      house: a.house, street: a.street, area: a.area, landmark: a.landmark,
      city: a.city, state: a.state, pincode: a.pincode,
      type: (a.type as Address["type"]) || "Home",
    };
    addAddress(addr);
    setSelectedAddr(addr.id);
    setShowAddrForm(false);
    setNewAddr({ type: "Home" });
    toast.success("Address saved");
  };

  const validatePayment = (): boolean => {
    if (payment === "card") {
      if (!validateCardNumber(card.number)) { toast.error("Enter a valid 16-digit card number"); return false; }
      if (!card.name.trim()) { toast.error("Enter card holder name"); return false; }
      if (!validateExpiry(card.expiry)) { toast.error("Enter expiry as MM/YY"); return false; }
      if (!validateCvv(card.cvv)) { toast.error("Enter a valid 3-4 digit CVV"); return false; }
    }
    if (payment === "upi" && !/^[\w.\-]+@[\w]+$/.test(upi)) { toast.error("Enter a valid UPI ID (e.g. name@upi)"); return false; }
    return true;
  };

  const next = () => {
    if (step === 0) {
      if (!selectedAddr) { toast.error("Please select a delivery address"); return; }
    }
    if (step === 2 && !validatePayment()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const confirmOrder = async () => {
    const addr = addresses.find((a) => a.id === selectedAddr);
    if (!addr) { toast.error("No address selected"); return; }
    setPlacing(true);
    const slotObj = SLOTS.find((s) => s.id === slot)!;
    const payLabel = PAYMENTS.find((p) => p.id === payment)!.label;
    // Save the address to the database for the logged-in user
    try {
      await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addr),
      });
    } catch { /* non-critical */ }
    // Place the order (saves to DB via API)
    const order = await placeOrder({ address: addr, slot: `${slotObj.label} (${slotObj.time})`, paymentMethod: payment, paymentLabel: payLabel });
    setPlacing(false);
    if (order) {
      analytics.purchaseCompleted(order.id, order.total);
      setLastOrder(order);
      toast.success("Order placed successfully! 🎉", { description: `Order ${order.id}` });
      close();
    } else {
      toast.error("Could not place order", { description: "Please try again." });
    }
  };

  const activeAddr = addresses.find((a) => a.id === selectedAddr);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[92] flex items-start justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:p-4"
          onClick={close}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="my-0 w-full max-w-4xl bg-background sm:my-4 sm:rounded-2xl sm:shadow-2xl"
          >
            {/* header + stepper */}
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-border bg-background/95 p-4 backdrop-blur sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold sm:text-xl">Checkout</h2>
                <button onClick={close} className="rounded-lg p-2 hover:bg-muted" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1">
                    <button
                      onClick={() => i < step && setStep(i)}
                      className={cn("flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold transition",
                        i === step ? "bg-karto-green text-white" : i < step ? "bg-karto-green/10 text-karto-green" : "bg-muted text-muted-foreground")}
                    >
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px]", i === step ? "bg-white/25" : i < step ? "bg-karto-green text-white" : "bg-background")}>
                        {i < step ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      {s}
                    </button>
                    {i < STEPS.length - 1 && <span className={cn("h-0.5 flex-1", i < step ? "bg-karto-green" : "bg-border")} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[1fr_320px]">
              {/* main step content */}
              <div className="min-h-[300px]">
                {/* STEP 0: address */}
                {step === 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><MapPin className="h-5 w-5 text-karto-green" /> Delivery Address</h3>
                    {addresses.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {addresses.map((a) => (
                          <label key={a.id} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition", selectedAddr === a.id ? "border-karto-green bg-karto-green/5" : "border-border hover:border-karto-green/40")}>
                            <input type="radio" name="addr" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} className="mt-1 accent-[var(--karto-green)]" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{a.fullName}</span>
                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">{a.type}</span>
                              </div>
                              <p className="mt-0.5 text-sm text-muted-foreground">{a.house}, {a.street}, {a.area}{a.landmark ? `, ${a.landmark}` : ""}, {a.city}, {a.state} - {a.pincode}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">📱 {a.phone}</p>
                            </div>
                            <button onClick={(e) => { e.preventDefault(); removeAddress(a.id); if (selectedAddr === a.id) setSelectedAddr(null); }} className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          </label>
                        ))}
                      </div>
                    )}

                    {!showAddrForm ? (
                      <button onClick={() => setShowAddrForm(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground transition hover:border-karto-green hover:text-karto-green">
                        <Plus className="h-4 w-4" /> Add new address
                      </button>
                    ) : (
                      <div className="rounded-xl border border-border p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <In label="Full Name *" value={newAddr.fullName} onChange={(v) => setNewAddr({ ...newAddr, fullName: v })} placeholder="Enter full name" />
                          <In label="Mobile Number *" value={newAddr.phone} onChange={(v) => setNewAddr({ ...newAddr, phone: v })} placeholder="Enter 10-digit mobile number" />
                          <In label="Alternate Number" value={newAddr.altPhone} onChange={(v) => setNewAddr({ ...newAddr, altPhone: v })} placeholder="Enter alternate number" />
                          <In label="House / Flat No *" value={newAddr.house} onChange={(v) => setNewAddr({ ...newAddr, house: v })} placeholder="Enter house or flat number" />
                          <In label="Street *" value={newAddr.street} onChange={(v) => setNewAddr({ ...newAddr, street: v })} placeholder="Enter street name" />
                          <In label="Area / Locality *" value={newAddr.area} onChange={(v) => setNewAddr({ ...newAddr, area: v })} placeholder="Enter area or locality" />
                          <In label="Landmark" value={newAddr.landmark} onChange={(v) => setNewAddr({ ...newAddr, landmark: v })} placeholder="Enter nearby landmark" />
                          <In label="City *" value={newAddr.city} onChange={(v) => setNewAddr({ ...newAddr, city: v })} placeholder="Enter city" />
                          <In label="State *" value={newAddr.state} onChange={(v) => setNewAddr({ ...newAddr, state: v })} placeholder="Enter state" />
                          <In label="Pincode *" value={newAddr.pincode} onChange={(v) => setNewAddr({ ...newAddr, pincode: v })} placeholder="Enter 6-digit pincode" />
                        </div>
                        <div className="mt-3">
                          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Address Type</p>
                          <div className="flex gap-2">
                            {(["Home", "Work", "Other"] as const).map((t) => (
                              <button key={t} onClick={() => setNewAddr({ ...newAddr, type: t })} className={cn("rounded-full border px-4 py-1.5 text-xs font-semibold", newAddr.type === t ? "border-karto-green bg-karto-green/10 text-karto-green" : "border-border")}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={saveAddress} className="rounded-full bg-karto-green px-5 py-2.5 text-sm font-bold text-white hover:bg-karto-green/90">Save address</button>
                          {addresses.length > 0 && <button onClick={() => setShowAddrForm(false)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted">Cancel</button>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 1: slot */}
                {step === 1 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><Clock className="h-5 w-5 text-karto-green" /> Choose Delivery Slot</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {SLOTS.map((s) => (
                        <button key={s.id} onClick={() => setSlot(s.id)} className={cn("relative flex items-center gap-3 rounded-xl border p-4 text-left transition", slot === s.id ? "border-karto-green bg-karto-green/5" : "border-border hover:border-karto-green/40")}>
                          <span className="text-3xl">{s.icon}</span>
                          <div>
                            <p className="font-bold">{s.label}</p>
                            <p className="text-xs text-muted-foreground">{s.time}</p>
                          </div>
                          {s.badge && <span className="absolute right-2 top-2 rounded-full bg-karto-yellow px-2 py-0.5 text-[10px] font-bold text-amber-950">{s.badge}</span>}
                          {slot === s.id && <Check className="absolute bottom-2 right-2 h-4 w-4 text-karto-green" />}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-karto-green" /> Express delivery is free for orders above ₹199 and arrives in under 30 minutes.
                    </p>
                  </div>
                )}

                {/* STEP 2: payment */}
                {step === 2 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><CreditCard className="h-5 w-5 text-karto-green" /> Payment Method</h3>
                    <div className="space-y-2">
                      {PAYMENTS.map((p) => (
                        <label key={p.id} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition", payment === p.id ? "border-karto-green bg-karto-green/5" : "border-border hover:border-karto-green/40")}>
                          <input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-[var(--karto-green)]" />
                          <p.icon className="h-5 w-5 text-karto-green" />
                          <span className="font-semibold">{p.label}</span>
                        </label>
                      ))}
                    </div>

                    {payment === "card" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-3 rounded-xl border border-border p-4">
                        <In label="Card Number" value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="Enter 16-digit card number" />
                        <In label="Card Holder Name" value={card.name} onChange={(v) => setCard({ ...card, name: v })} placeholder="Enter name as on card" />
                        <div className="grid grid-cols-2 gap-3">
                          <In label="Expiry (MM/YY)" value={card.expiry} onChange={(v) => setCard({ ...card, expiry: v })} placeholder="Enter expiry month/year" />
                          <In label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v })} placeholder="Enter CVV" />
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-karto-green" /> Your card details are encrypted & secure.</p>
                      </motion.div>
                    )}
                    {payment === "upi" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 rounded-xl border border-border p-4">
                        <In label="UPI ID" value={upi} onChange={(v) => setUpi(v)} placeholder="Enter your UPI ID" />
                      </motion.div>
                    )}
                    {payment === "cod" && (
                      <p className="mt-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">Pay with cash/UPI at the time of delivery. A small ₹0 handling fee may apply.</p>
                    )}
                    {(payment === "netbanking" || payment === "wallet") && (
                      <p className="mt-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">You&apos;ll be redirected to your {payment === "netbanking" ? "bank" : "wallet"} to complete the payment securely.</p>
                    )}
                  </div>
                )}

                {/* STEP 3: review */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-base font-bold"><ShoppingCart className="h-5 w-5 text-karto-green" /> Review your order</h3>
                    {/* items */}
                    <div className="rounded-xl border border-border p-3">
                      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Items ({cart.length})</p>
                      <div className="max-h-48 space-y-2 overflow-y-auto">
                        {cart.map((item) => {
                          const p = productMap[item.productId];
                          if (!p) return null;
                          return (
                            <div key={item.productId} className="flex items-center gap-3">
                              <ProductImage image={p.image} emoji={p.emoji} gradient={p.gradient} size="sm" className="h-11 w-11 shrink-0 rounded-lg" />
                              <div className="flex-1"><p className="line-clamp-1 text-sm font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{item.qty} × {formatPrice(p.price)}</p></div>
                              <span className="text-sm font-bold">{formatPrice(p.price * item.qty)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* address */}
                    {activeAddr && (
                      <div className="rounded-xl border border-border p-3">
                        <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Deliver to</p>
                        <p className="text-sm font-semibold">{activeAddr.fullName} · {activeAddr.phone}</p>
                        <p className="text-sm text-muted-foreground">{activeAddr.house}, {activeAddr.street}, {activeAddr.area}, {activeAddr.city}, {activeAddr.state} - {activeAddr.pincode}</p>
                      </div>
                    )}
                    {/* slot + payment */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border p-3">
                        <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Slot</p>
                        <p className="text-sm font-semibold">{SLOTS.find((s) => s.id === slot)?.label}</p>
                        <p className="text-xs text-muted-foreground">{SLOTS.find((s) => s.id === slot)?.time}</p>
                      </div>
                      <div className="rounded-xl border border-border p-3">
                        <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><CreditCard className="h-3.5 w-3.5" /> Payment</p>
                        <p className="text-sm font-semibold">{PAYMENTS.find((p) => p.id === payment)?.label}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: confirm */}
                {step === 4 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-karto-green/10 text-4xl">✅</motion.div>
                    <h3 className="mt-4 text-xl font-bold">Ready to place your order?</h3>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">By clicking “Place Order”, you agree to Karto&apos;s Terms & Conditions. You&apos;ll pay <span className="font-bold text-foreground">{formatPrice(totals.total)}</span> via {PAYMENTS.find((p) => p.id === payment)?.label}.</p>
                  </div>
                )}

                {/* nav */}
                <div className="mt-6 flex items-center justify-between">
                  <button onClick={back} disabled={step === 0} className="flex items-center gap-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button onClick={next} className="flex items-center gap-1 rounded-full bg-karto-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90">
                      Continue <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={confirmOrder} disabled={placing} className="flex items-center gap-2 rounded-full bg-karto-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90 disabled:opacity-60">
                      {placing ? "Placing order..." : <>Place Order · {formatPrice(totals.total)}</>}
                    </button>
                  )}
                </div>
              </div>

              {/* summary sidebar */}
              <aside className="h-fit rounded-2xl border border-border bg-card p-4">
                <h4 className="mb-3 text-sm font-bold">Order Summary</h4>
                <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
                  {cart.map((item) => {
                    const p = productMap[item.productId];
                    if (!p) return null;
                    return (
                      <div key={item.productId} className="flex items-center gap-2 text-xs">
                        <ProductImage image={p.image} emoji={p.emoji} gradient={p.gradient} size="sm" className="h-9 w-9 shrink-0 rounded-md" />
                        <div className="flex-1"><p className="line-clamp-1 font-semibold">{p.name}</p><p className="text-muted-foreground">{item.qty} × {formatPrice(p.price)}</p></div>
                        <span className="font-bold">{formatPrice(p.price * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1.5 border-t border-dashed border-border pt-3 text-sm">
                  <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                  <Row label="Taxes (5%)" value={formatPrice(totals.tax)} />
                  <Row label="Delivery" value={totals.delivery === 0 ? "FREE" : formatPrice(totals.delivery)} green={totals.delivery === 0} />
                  {totals.discount > 0 && <Row label="Coupon discount" value={`−${formatPrice(totals.discount)}`} green />}
                  {totals.savings > 0 && <Row label="Product savings" value={`−${formatPrice(totals.savings)}`} green />}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-extrabold text-karto-green">{formatPrice(totals.total)}</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-karto-green" /> Estimated delivery {estimatedDelivery(15)}
                </p>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function In({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-karto-green" />
    </label>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold", green && "text-karto-green")}>{value}</span>
    </div>
  );
}
