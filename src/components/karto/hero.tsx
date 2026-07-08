"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Clock, ShieldCheck, Zap, Star, Navigation, Loader2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/components/karto/store";
import { products } from "@/data/products";
import { analytics } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { detectLocation } from "@/lib/geo";
import { categoryImages } from "@/data/image-map";

export function Hero() {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const location = useStore((s) => s.location);
  const setLocation = useStore((s) => s.setLocation);
  const [q, setQ] = useState("");
  const [detecting, setDetecting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.search(q);
    setSearchOpen(true);
  };

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const result = await detectLocation();
      setLocation(result.short);
      toast.success("Location detected", { description: result.short, duration: 2500 });
    } catch (err) {
      toast.error("Couldn't detect location", {
        description: err instanceof Error ? err.message : "Please enable location permission.",
        duration: 3000,
      });
    } finally {
      setDetecting(false);
    }
  };

  // floating preview products with real images
  const floats = [products[0], products[8], products[18], products[40]];
  // 4 category tiles for the right grid
  const catTiles = ["fruits", "dairy", "snacks", "bakery"].map((c) => ({
    id: c,
    img: categoryImages[c],
  }));

  return (
    <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
      {/* decorative glow blobs */}
      <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-karto-green/30 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-karto-yellow/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* LEFT — pitch + search + location (span 7) */}
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

            {/* search */}
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-2xl"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search "milk", "bananas", "chips"...'
                className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-karto-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90 active:scale-95"
              >
                Search
              </button>
            </motion.form>

            {/* location with detect button */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-karto-green" />
                Delivering to <span className="font-semibold text-white">{location}</span>
              </div>
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
              >
                {detecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                {detecting ? "Detecting..." : "Detect my location"}
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

          {/* RIGHT — modern visual grid (span 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-3">
              {/* large feature image */}
              <div className="relative col-span-2 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <div className="aspect-[16/9] w-full">
                  <img
                    src="/karto/hero.png"
                    alt="Fresh groceries delivered by Karto"
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
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
              {catTiles.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-lg"
                >
                  {c.img && (
                    <img
                      src={c.img}
                      alt={c.id}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-xs font-bold capitalize text-white drop-shadow">
                    {c.id.replace("-", " ")}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* floating product chips */}
            {floats.slice(0, 2).map((p, i) => {
              const pos = ["-left-3 top-1/3", "-right-3 bottom-10"][i];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.15 }}
                  className={`absolute ${pos} hidden items-center gap-2 rounded-2xl border border-white/10 bg-background/95 p-1.5 pr-3 text-foreground shadow-xl backdrop-blur xl:flex`}
                >
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted/30">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
