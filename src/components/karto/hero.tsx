"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/karto/store";
import { products } from "@/data/products";
import { analytics } from "@/lib/analytics";
import { ProductImage } from "@/components/karto/primitives";

export function Hero() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const location = useStore((s) => s.location);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.search(q);
    setSearchOpen(true);
  };

  // a few floating preview products
  const floats = [products[0], products[10], products[30], products[48]];

  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
      <div className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-karto-green/20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-karto-yellow/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-16 lg:py-20">
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
            Your everyday
            <br />
            <span className="text-gradient-green">shopping partner</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            Fresh groceries, dairy, snacks & daily essentials delivered to your door in minutes — at the best prices, every single day.
          </motion.p>

          {/* search */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:border-karto-green"
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
              className="shrink-0 rounded-full bg-karto-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90 active:scale-95"
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
            className="mt-7 flex flex-wrap gap-x-6 gap-y-3"
          >
            {[
              { icon: Clock, label: "10-min delivery", sub: "Lightning fast" },
              { icon: ShieldCheck, label: "100% fresh", sub: "Quality assured" },
              { icon: Zap, label: "Best prices", sub: "Guaranteed savings" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-karto-green/10 text-karto-green">
                  <b.icon className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
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
                onError={(e) => {
                  (e.currentTarget.style.display = "none");
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-karto-green/30 to-transparent" />
            </div>

            {/* floating product chips */}
            {floats.map((p, i) => {
              const pos = [
                "left-0 top-8",
                "right-0 top-20",
                "left-6 bottom-6",
                "right-4 bottom-24",
              ][i];
              return (
                <motion.div
                  key={p.id}
                  className={`absolute ${pos} flex items-center gap-2 rounded-2xl border border-border bg-card/90 p-2 pr-3 shadow-lg backdrop-blur animate-float`}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <ProductImage emoji={p.emoji} gradient={p.gradient} size="sm" className="h-10 w-10 rounded-xl" />
                  <div className="leading-tight">
                    <p className="max-w-24 truncate text-xs font-semibold">{p.name}</p>
                    <p className="text-xs font-bold text-karto-green">₹{p.price}</p>
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
