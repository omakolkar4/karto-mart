"use client";

import { useEffect } from "react";
import { useStore } from "@/components/karto/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually rehydrate persisted state on the client to avoid SSR mismatch.
    useStore.persist.rehydrate();

    // Global Escape handler: closes whichever overlay is open (top-most first).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Don't hijack Escape while typing in a field that needs it (let default).
      const s = useStore.getState();
      if (s.searchOpen) { s.setSearchOpen(false); return; }
      if (s.checkoutOpen) { s.setCheckoutOpen(false); return; }
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

  // Render children always; components guard persisted values with useHydrated().
  return <>{children}</>;
}

/** Hook to know when persisted state has been rehydrated on the client. */
export function useHydrated() {
  return useStore((s) => s._hasHydrated);
}
