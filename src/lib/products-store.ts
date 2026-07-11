"use client";

import { create } from "zustand";
import type { Product } from "@/data/products";
import { products as staticProducts, productMap as staticProductMap } from "@/data/products";

type ProductsState = {
  products: Product[];
  productMap: Record<string, Product>;
  loading: boolean;
  loaded: boolean;
  fetchProducts: () => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Start with static data so the UI renders instantly, then replace with DB data.
  products: staticProducts,
  productMap: staticProductMap,
  loading: false,
  loaded: false,

  fetchProducts: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      const products: Product[] = Array.isArray(data.products) ? data.products : [];

      if (products.length === 0) {
        set({ loading: false, loaded: true });
        return;
      }

      const productMap: Record<string, Product> = {};
      for (const p of products) productMap[p.id] = p;
      set({ products, productMap, loading: false, loaded: true });
    } catch {
      // Keep static data on error
      set({ loading: false, loaded: true });
    }
  },
}));

/** Hook that returns a product by ID from the live store. */
export function useProductById(id: string | null): Product | null {
  return useProductsStore((s) => (id ? s.productMap[id] ?? null : null));
}
