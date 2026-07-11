"use client";

import { motion } from "framer-motion";
import { Zap, Clock, ShieldCheck, TrendingUp, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/components/karto/store";
import { products } from "@/data/products";
import { categoryImages } from "@/data/image-map";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import { analytics } from "@/lib/analytics";

export function Hero() {
  const navigateToCategory = useStore((s) => s.navigateToCategory);
  const openProduct = useStore((s) => s.openProduct);

  // 4 category tiles for the right grid
  const catTiles = (["fruits", "dairy", "snacks", "bakery"] as const)
    .map((id) => categories.find((c) => c.id === id)!)
    .filter(Boolean);

  const trending = [products[0], products[18]];

  return (
    <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
      {/* decorative glow blobs */}
      <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-karto-green/30 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-karto-yellow/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* LEFT — pitch + trust badges (no search bar, no detect button — those are in the navbar) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-karto-green backdrop-blur"
            >
              <Zap className="h-3.5 w-3.5 fill-karto-green" />
              Delivery in 10 minutes · Open 6 AM – 2 AM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.5rem]"
            >
              Groceries delivered in
              <br />
              <span className="text-gradient-green">minutes, not hours</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 max-w-lg text-base text-white/70 sm:text-lg"
            >
              Fresh fruits, vegetables, dairy, snacks & daily essentials at your doorstep — at the best prices, every single day.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <button
                onClick={() => {
                  const el = document.getElementById("bestsellers");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-xl bg-karto-green px-5 py-3 text-sm font-bold text-white transition hover:bg-karto-green/90 active:scale-95"
              >
                Shop bestsellers <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigateToCategory("fruits")}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse categories
              </button>
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
                <div key={b.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-karto-green/20 text-karto-green">
                    <b.icon className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-white">{b.label}</p>
                    <p className="text-[11px] text-white/60">{b.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — clean visual: feature image + category tiles + trending strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:col-span-5"
          >
            {/* large feature image */}
            <div className="relative mb-3 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <div className="aspect-[16/10] w-full">
                <img
                  src="/karto/hero.png"
                  alt="Fresh groceries delivered by Karto"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-karto-green px-3.5 py-2 text-sm font-bold text-white shadow-lg"
              >
                <Clock className="h-4 w-4 fill-white" />
                Delivered in 10 mins
              </motion.div>
            </div>

            {/* 2x2 category tiles */}
            <div className="grid grid-cols-2 gap-3">
              {catTiles.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -3 }}
                  onClick={() => { analytics.categoryClick(c.id); navigateToCategory(c.id); }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-lg"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-sm font-bold text-white drop-shadow">
                    {c.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* trending strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-3 flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur"
            >
              <span className="flex items-center gap-1 pl-1.5 text-[11px] font-bold uppercase tracking-wide text-karto-green">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </span>
              <div className="flex flex-1 gap-2 overflow-hidden">
                {trending.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { analytics.productClick(p.id); openProduct(p.id); }}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/5 p-1.5 transition hover:bg-white/10"
                  >
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                      {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-xs font-semibold text-white">{p.name}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-karto-green">{formatPrice(p.price)}</p>
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                          <Star className="h-2 w-2 fill-amber-400" />{p.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
