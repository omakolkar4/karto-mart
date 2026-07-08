"use client";

import { motion } from "framer-motion";
import { Heart, Plus, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { discountPct } from "@/data/products";
import { useStore } from "@/components/karto/store";
import { ProductImage, Stars, QuantitySelector } from "@/components/karto/primitives";
import { formatPrice } from "@/lib/format";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const cartQty = useStore((s) => s.cart.find((i) => i.productId === product.id)?.qty ?? 0);
  const addToCart = useStore((s) => s.addToCart);
  const incQty = useStore((s) => s.incQty);
  const decQty = useStore((s) => s.decQty);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const openProduct = useStore((s) => s.openProduct);

  const inWishlist = wishlist.includes(product.id);
  const pct = discountPct(product);
  const out = !product.inStock;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (out) return;
    addToCart(product, 1);
    analytics.addToCart(product.id, product.price);
    toast.success("Added to cart", { description: product.name, duration: 1800 });
  };

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!inWishlist) {
      analytics.wishlist(product.id);
      toast.success("Added to wishlist", { description: product.name, duration: 1800 });
    }
  };

  const open = () => {
    analytics.productClick(product.id);
    openProduct(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      onClick={open}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card karto-shadow transition hover:karto-shadow-lg"
    >
      {/* badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-sm">BESTSELLER</span>
        )}
        {product.isNew && (
          <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">NEW</span>
        )}
        {product.isFlashSale && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">FLASH</span>
        )}
      </div>

      {/* wishlist */}
      <button
        onClick={handleWish}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur transition hover:scale-110 dark:bg-black/40",
          inWishlist ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500")} />
      </button>

      {/* image */}
      <div className="relative aspect-square w-full">
        <ProductImage emoji={product.emoji} gradient={product.gradient} size="lg" className="h-full w-full" />
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-foreground/80 px-3 py-1 text-xs font-bold text-background">Out of stock</span>
          </div>
        )}
        {pct > 0 && !out && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-karto-green px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">{pct}% OFF</span>
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.unit}</p>

        <div className="mt-1 flex items-center gap-1.5">
          <Stars rating={product.rating} size={12} showValue />
        </div>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3 text-karto-green" />
          <span>{product.deliveryMins} min</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="text-base font-extrabold leading-none">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
            )}
          </div>

          {cartQty > 0 ? (
            <QuantitySelector qty={cartQty} onInc={() => incQty(product.id)} onDec={() => decQty(product.id)} size="sm" />
          ) : (
            <button
              onClick={handleAdd}
              disabled={out}
              aria-label="Add to cart"
              className={cn(
                "flex h-9 items-center gap-1 rounded-full px-3 text-xs font-bold transition",
                out
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-karto-green text-white hover:bg-karto-green/90 active:scale-95"
              )}
            >
              {out ? <Check className="h-4 w-4 opacity-0" /> : <Plus className="h-4 w-4" />}
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
