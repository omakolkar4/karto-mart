"use client";

import { useEffect } from "react";
import { useStore } from "@/components/karto/store";
import { useProductsStore } from "@/lib/products-store";
import { AutoLocationDetect } from "@/components/karto/auto-location-detect";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually rehydrate persisted state on the client to avoid SSR mismatch.
    useStore.persist.rehydrate();
    // Restore user session from the DB (httpOnly cookie auth)
    useStore.getState().restoreSession();
    // Fetch live products from the database (replaces static data)
    useProductsStore.getState().fetchProducts();

    // Global Escape handler: closes whichever overlay is open (top-most first).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = useStore.getState();
      if (s.searchOpen) { s.setSearchOpen(false); return; }
      if (s.checkoutOpen) { s.setCheckoutOpen(false); return; }
      if (s.locationModalOpen) { s.setLocationModalOpen(false); return; }
      if (s.categoriesDrawerOpen) { s.setCategoriesDrawerOpen(false); return; }
      if (s.infoModalContent) { s.setInfoModalContent(null); return; }
      if (s.authOpen) { s.setAuthOpen(false); return; }
      if (s.accountOpen) { s.setAccountOpen(false); return; }
      if (s.contactOpen) { s.setContactOpen(false); return; }
      if (s.lastOrder) { s.setLastOrder(null); return; }
      if (s.productModalId) { s.openProduct(null); return; }
      if (s.cartOpen) { s.setCartOpen(false); return; }
      if (s.wishlistOpen) { s.setWishlistOpen(false); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {children}
      <AutoLocationDetect />
    </>
  );
}

/** Hook to know when persisted state has been rehydrated on the client. */
export function useHydrated() {
  return useStore((s) => s._hasHydrated);
}
