"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Emoji-based product tile with gradient background. Looks like a stylised product photo. */
export function ProductImage({
  emoji,
  gradient,
  size = "md",
  className,
}: {
  emoji: string;
  gradient: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
    xl: "text-8xl",
  };
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      {/* subtle radial highlight */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40 blur-2xl dark:bg-white/10" />
      <motion.span
        initial={{ scale: 0.85, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={cn("drop-shadow-sm", sizes[size])}
        role="img"
        aria-hidden
      >
        {emoji}
      </motion.span>
    </div>
  );
}

export function Stars({
  rating,
  size = 14,
  className,
  showValue = false,
  reviews,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  reviews?: number;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(rating);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/40"}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
      )}
      {typeof reviews === "number" && (
        <span className="text-xs text-muted-foreground">({reviews.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}

export function QuantitySelector({
  qty,
  onInc,
  onDec,
  size = "md",
}: {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8" : "h-9";
  const btn = size === "sm" ? "w-8" : "w-9";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-border bg-card", h)}>
      <button
        onClick={onDec}
        aria-label="Decrease quantity"
        className={cn("flex h-full items-center justify-center rounded-l-full text-muted-foreground transition hover:text-karto-green", btn)}
      >
        −
      </button>
      <span className="min-w-7 text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button
        onClick={onInc}
        aria-label="Increase quantity"
        className={cn("flex h-full items-center justify-center rounded-r-full text-muted-foreground transition hover:text-karto-green", btn)}
      >
        +
      </button>
    </div>
  );
}

export function DiscountBadge({ pct, className }: { pct: number; className?: string }) {
  if (pct <= 0) return null;
  return (
    <span className={cn("rounded-full bg-karto-green px-2 py-0.5 text-[10px] font-bold text-white shadow-sm", className)}>
      {pct}% OFF
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-karto-green">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
