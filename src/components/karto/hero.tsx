"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, Zap, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/karto/store";
import { products } from "@/data/products";
import { analytics } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";

export function Hero() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const location = useStore((s) => s.location);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.search(q);
    setSearchOpen(true);
  };

  // floating preview products with real images
  const floats = [products[0], products[8], products[18], products[40]];

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
      <div className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-karto-green/20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-karto-yellow/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 md:py-12 lg:py-16">
        {/* left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-karto-green/30 bg-karto-green/10 px-3 py-1 text-xs font-semibold text-karto-green"
          >
            <Zap className="h-3.5 w-3.5 fill-karto-green" />
            Delivery in 10 minutes
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Groceries delivered in
            <br />
            <span className="text-gradient-green">minutes, not hours</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            Fresh fruits, vegetables, dairy, snacks & daily essentials at your doorstep — at the best prices, every single day.
          </motion.p>

          {/* search */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm focus-within:border-karto-green focus-within:shadow-md"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search "milk", "bananas", "chips"...'
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-karto-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90 active:scale-95"
            >
              Search
            </button>
          </motion.form>

          {/* location */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin className="h-4 w-4 text-karto-green" />
            Delivering to <span className="font-semibold text-foreground">{location}</span>
          </motion.div>

          {/* trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-7 grid grid-cols-3 gap-3"
          >
            {[
              { icon: Clock, label: "10 min", sub: "delivery" },
              { icon: ShieldCheck, label: "100%", sub: "fresh" },
              { icon: TrendingUp, label: "Best", sub: "prices" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-2.5 backdrop-blur">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-karto-green/10 text-karto-green">
                  <b.icon className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold">{b.label}</p>
                  <p className="text-[11px] text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right visual — real product collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative hidden md:block"
        >
          <div className="relative mx-auto aspect-square max-w-md">
            {/* main hero image */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
              <img
                src="/karto/hero.png"
                alt="Fresh groceries delivered by Karto"
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-karto-green/30 via-transparent to-transparent" />
            </div>

            {/* floating product chips with real images */}
            {floats.map((p, i) => {
              const pos = ["left-0 top-8", "right-0 top-20", "left-6 bottom-6", "right-4 bottom-24"][i];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.12, type: "spring", stiffness: 200 }}
                  className={`absolute ${pos} flex items-center gap-2 rounded-2xl border border-border bg-card/95 p-1.5 pr-3 shadow-lg backdrop-blur animate-float`}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <div className="h-11 w-11 overflow-hidden rounded-xl bg-muted/30">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="max-w-24 truncate text-xs font-semibold">{p.name}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-karto-green">{formatPrice(p.price)}</p>
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        <Star className="h-2 w-2 fill-amber-400" />{p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* delivery badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-karto-green px-4 py-2 text-sm font-bold text-white shadow-lg karto-shadow-green"
            >
              <Clock className="h-4 w-4 fill-white" />
              Delivered in 10 mins
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
