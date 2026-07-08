"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/karto/product-card";
import { useRef } from "react";

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = Math.floor(diff / 3.6e6);
  const m = Math.floor((diff % 3.6e6) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  return { h, m, s };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FlashSale() {
  // 8 hours from first render
  const [target] = useState(() => Date.now() + 8 * 3.6e6);
  const { h, m, s } = useCountdown(target);
  const ref = useRef<HTMLDivElement>(null);
  const flash = products.filter((p) => p.isFlashSale).concat(products.filter((p) => p.isBestSeller)).slice(0, 10);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="flash-sale" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-5 dark:border-red-900/40 dark:from-red-950/30 dark:via-orange-950/20 dark:to-amber-950/20 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg"
            >
              <Flame className="h-6 w-6" />
            </motion.span>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-red-600 dark:text-red-400 sm:text-3xl">Flash Sale 🔥</h2>
              <p className="text-sm text-muted-foreground">Hurry! Deals end soon</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[{ v: h, l: "Hrs" }, { v: m, l: "Min" }, { v: s, l: "Sec" }].map((u, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-foreground px-2 text-lg font-black tabular-nums text-background">
                    {pad(u.v)}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground">{u.l}</span>
                </div>
              ))}
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:border-red-400 hover:text-red-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:border-red-400 hover:text-red-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div ref={ref} className="hide-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {flash.map((p) => (
            <div key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
