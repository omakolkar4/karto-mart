"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/karto/product-card";
import { SectionHeading } from "@/components/karto/primitives";
import { cn } from "@/lib/utils";

export function ProductRail({
  eyebrow,
  title,
  subtitle,
  products,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:border-karto-green hover:text-karto-green"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:border-karto-green hover:text-karto-green"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />
      <div
        ref={ref}
        className="hide-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2"
      >
        {products.map((p) => (
          <div key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
