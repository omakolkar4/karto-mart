"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Clock, ShieldCheck, Tag, Truck, Headphones, Leaf, Star, Apple, ChevronRight, Zap, Gift, Percent } from "lucide-react";
import { toast } from "sonner";
import { popularBrands, reviews, coupons } from "@/data/extras";
import { analytics } from "@/lib/analytics";
import { useStore } from "@/components/karto/store";
import { Stars } from "@/components/karto/primitives";

/* ---------------- Best Deals promo strip (top of page) ---------------- */
export function BestDeals() {
  const applyCoupon = useStore((s) => s.applyCoupon);
  const deals = [
    { icon: Zap, title: "Flash Sale", sub: "Up to 50% off", color: "from-red-500 to-rose-600", code: "KARTO50" },
    { icon: Gift, title: "First Order", sub: "₹100 off above ₹599", color: "from-emerald-500 to-green-600", code: "FRESH100" },
    { icon: Percent, title: "Weekend Special", sub: "15% off up to ₹200", color: "from-amber-500 to-orange-600", code: "WEEKEND15" },
    { icon: Truck, title: "Free Delivery", sub: "On orders ₹199+", color: "from-sky-500 to-cyan-600", code: null },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {deals.map((d, i) => (
          <motion.button
            key={d.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={() => {
              if (d.code) {
                const c = coupons.find((x) => x.code === d.code);
                if (c) {
                  const ok = applyCoupon(c);
                  if (ok) toast.success(`${d.title} applied!`, { description: c.description });
                  else toast.error("Add items first", { description: `Add ₹${c.minOrder}+ to use this offer.` });
                }
              } else {
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${d.color} p-4 text-left text-white shadow-lg`}
          >
            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/15 transition group-hover:scale-125" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <d.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{d.title}</p>
                <p className="truncate text-xs text-white/85">{d.sub}</p>
              </div>
            </div>
            {d.code && (
              <span className="absolute bottom-2 right-2 rounded-md border border-dashed border-white/60 bg-white/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider">
                {d.code}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Brands marquee ---------------- */
export function Brands() {
  const list = [...popularBrands, ...popularBrands];
  return (
    <section className="border-y border-border bg-card py-8">
      <div className="mx-auto mb-5 max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Trusted brands you love
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-3">
          {list.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold"
            >
              <span className="text-xl">{b.emoji}</span> {b.name}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent" />
      </div>
    </section>
  );
}

/* ---------------- Why Choose Karto ---------------- */
export function WhyChooseUs() {
  const items = [
    { icon: Clock, title: "10-Minute Delivery", desc: "Lightning-fast delivery to your doorstep, day or night.", color: "bg-green-500" },
    { icon: ShieldCheck, title: "Quality Assured", desc: "Every product is freshness-checked before it reaches you.", color: "bg-emerald-500" },
    { icon: Tag, title: "Best Prices", desc: "Unbeatable prices with daily deals and exclusive coupons.", color: "bg-amber-500" },
    { icon: Truck, title: "Free Delivery", desc: "Free delivery on all orders above ₹199, no hidden charges.", color: "bg-teal-500" },
    { icon: Headphones, title: "24/7 Support", desc: "Real humans ready to help, whenever you need us.", color: "bg-sky-500" },
    { icon: Leaf, title: "Fresh & Sustainable", desc: "Sourced responsibly with eco-friendly packaging.", color: "bg-lime-500" },
  ];
  return (
    <section id="why-us" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">Why Karto</p>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Built for your everyday needs</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          We obsess over speed, quality and value so you can spend your time on what matters most.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${it.color} text-white shadow-sm transition group-hover:scale-110`}>
              <it.icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold">{it.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
export function Stats() {
  const stats = [
    { value: "10 min", label: "Average delivery" },
    { value: "1000+", label: "Products" },
    { value: "5L+", label: "Happy customers" },
    { value: "4.8★", label: "Average rating" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-3 rounded-3xl bg-karto-green p-6 text-white sm:grid-cols-4 sm:p-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-black sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-white/80 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">Loved by thousands</p>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">What our customers say</h2>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-semibold">4.8 / 5 from 12,400+ reviews</span>
        </div>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex flex-col rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-karto-green/10 text-2xl">
                  {r.avatar}
                </span>
                <div>
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.location} · {r.date}</p>
                </div>
              </div>
              <Stars rating={r.rating} size={14} />
            </div>
            <h4 className="text-sm font-bold">{r.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Offers banner ---------------- */
export function Offers() {
  const applyCoupon = useStore((s) => s.applyCoupon);
  return (
    <section id="offers" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">Save more</p>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Today&apos;s offers & coupons</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {coupons.map((c, i) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.color} p-5 text-white`}
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
            <p className="text-2xl font-black">{c.title}</p>
            <p className="mt-1 text-sm text-white/90">{c.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <code className="rounded-lg border border-dashed border-white/60 bg-white/15 px-2.5 py-1 text-sm font-bold tracking-wider">
                {c.code}
              </code>
              <button
                onClick={() => {
                  const ok = applyCoupon(c);
                  if (ok) toast.success("Coupon applied!", { description: `${c.title} — ${c.description}` });
                  else toast.error("Coupon not applied", { description: `Add items worth ₹${c.minOrder}+ to use this.` });
                }}
                className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground transition hover:bg-white"
              >
                Apply <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Download app ---------------- */
export function DownloadApp() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-karto-green to-emerald-600 p-8 text-white sm:p-12">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              Download the Karto app
            </p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Get groceries in minutes, right from your pocket.
            </h2>
            <p className="mt-3 max-w-md text-white/90">
              Exclusive app-only deals, faster checkout, live order tracking and instant notifications. Join 5L+ happy shoppers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-left text-white transition hover:opacity-90">
                <Apple className="h-7 w-7" />
                <div>
                  <p className="text-[10px] leading-none">Download on the</p>
                  <p className="text-base font-bold leading-tight">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-left text-white transition hover:opacity-90">
                <span className="text-2xl">▶</span>
                <div>
                  <p className="text-[10px] leading-none">GET IT ON</p>
                  <p className="text-base font-bold leading-tight">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-64 md:block">
            <img
              src="/karto/app-mockup.png"
              alt="Karto mobile app"
              className="h-full w-full rounded-3xl object-cover shadow-2xl"
              onError={(e) => { (e.currentTarget.style.display = "none"); }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    analytics.newsletterSubscribed();
    toast.success("Subscribed! 🎉", { description: "You'll get the best deals in your inbox." });
    setEmail("");
  };
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 text-center karto-shadow">
        <span className="text-4xl">📬</span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Never miss a deal</h2>
          <p className="mt-1 text-sm text-muted-foreground">Subscribe to our newsletter for exclusive offers, new arrivals and grocery tips.</p>
        </div>
        <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none focus:border-karto-green"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-karto-green px-6 text-sm font-bold text-white transition hover:bg-karto-green/90 active:scale-95"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
