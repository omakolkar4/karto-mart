"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/data/products";
import type { Coupon } from "@/data/extras";
import {
  computeTax,
  computeDelivery,
  DELIVERY_FEE,
  generateOrderId,
  TAX_RATE,
} from "@/lib/format";
import { useProductsStore } from "@/lib/products-store";

export type CartItem = { productId: string; qty: number };

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  altPhone?: string;
  house: string;
  street: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work" | "Other";
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  gradient: string;
  unit: string;
};

export type OrderStatus = "Placed" | "Confirmed" | "Out for Delivery" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  delivery: number;
  discount: number;
  total: number;
  address: Address;
  slot: string;
  paymentMethod: string;
  paymentLabel: string;
  status: OrderStatus;
  placedAt: number;
  etaMins: number;
};

export type User = { name: string; email: string; phone?: string };

type UIState = {
  cartOpen: boolean;
  wishlistOpen: boolean;
  searchOpen: boolean;
  authOpen: boolean;
  accountOpen: boolean;
  checkoutOpen: boolean;
  contactOpen: boolean;
  locationModalOpen: boolean;
  categoriesDrawerOpen: boolean;
  infoModalContent: string | null;
  productModalId: string | null;
  lastOrder: Order | null;
  selectedCategory: string | null;
  view: "home" | "category";
  activeCategory: string | null;
  location: string;
  locationDetected: boolean;
  searchInitialQuery: string;
};

type StoreState = UIState & {
  _hasHydrated: boolean;
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  orders: Order[];
  addresses: Address[];
  appliedCoupon: (Coupon & { _id: string }) | null;
  notifiedProducts: string[];

  // UI setters
  setCartOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  openSearch: (query?: string) => void;
  setAuthOpen: (v: boolean) => void;
  setAccountOpen: (v: boolean) => void;
  setCheckoutOpen: (v: boolean) => void;
  setContactOpen: (v: boolean) => void;
  setLocationModalOpen: (v: boolean) => void;
  setCategoriesDrawerOpen: (v: boolean) => void;
  openInfoModal: (content: string) => void;
  setInfoModalContent: (c: string | null) => void;
  openProduct: (id: string | null) => void;
  setLastOrder: (o: Order | null) => void;
  setSelectedCategory: (c: string | null) => void;
  navigateToCategory: (c: string) => void;
  navigateHome: () => void;
  setLocation: (l: string) => void;
  setLocationDetected: (v: boolean) => void;
  setHydrated: () => void;
  toggleNotify: (productId: string) => void;

  // cart actions
  addToCart: (product: Product, qty?: number) => void;
  incQty: (productId: string) => void;
  decQty: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  moveToWishlist: (productId: string) => void;

  // wishlist
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  wishlistToCart: (productId: string) => void;

  // coupon
  applyCoupon: (c: Coupon) => boolean;
  removeCoupon: () => void;

  // auth
  login: (u: User) => void;
  signup: (u: User) => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  signupWithCredentials: (data: { name: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  logoutApi: () => Promise<void>;
  restoreSession: () => Promise<void>;

  // addresses
  addAddress: (a: Address) => void;
  removeAddress: (id: string) => void;

  // orders
  placeOrder: (data: { address: Address; slot: string; paymentMethod: string; paymentLabel: string }) => Promise<{ order: Order | null; error?: string }>;
  cancelOrder: (orderId: string) => void;
  reorder: (orderId: string) => void;
};

const DEFAULT_LOCATION = "";

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // UI defaults
      cartOpen: false,
      wishlistOpen: false,
      searchOpen: false,
      authOpen: false,
      accountOpen: false,
      checkoutOpen: false,
      contactOpen: false,
      locationModalOpen: false,
      categoriesDrawerOpen: false,
      infoModalContent: null,
      productModalId: null,
      lastOrder: null,
      selectedCategory: null,
      view: "home",
      activeCategory: null,
      location: DEFAULT_LOCATION,
      locationDetected: false,
      searchInitialQuery: "",
      _hasHydrated: false,

      cart: [],
      wishlist: [],
      user: null,
      orders: [],
      addresses: [],
      appliedCoupon: null,
      notifiedProducts: [],

      setCartOpen: (v) => set({ cartOpen: v }),
      setWishlistOpen: (v) => set({ wishlistOpen: v }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      openSearch: (query) => set({ searchOpen: true, searchInitialQuery: query ?? "" }),
      setAuthOpen: (v) => set({ authOpen: v }),
      setAccountOpen: (v) => set({ accountOpen: v }),
      setCheckoutOpen: (v) => set({ checkoutOpen: v }),
      setContactOpen: (v) => set({ contactOpen: v }),
      setLocationModalOpen: (v) => set({ locationModalOpen: v }),
      setCategoriesDrawerOpen: (v) => set({ categoriesDrawerOpen: v }),
      openInfoModal: (content) => set({ infoModalContent: content }),
      setInfoModalContent: (c) => set({ infoModalContent: c }),
      openProduct: (id) => set({ productModalId: id }),
      setLastOrder: (o) => set({ lastOrder: o }),
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      navigateToCategory: (c) => {
        set({ view: "category", activeCategory: c, selectedCategory: c });
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      navigateHome: () => {
        set({ view: "home", activeCategory: null, selectedCategory: null });
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      setLocation: (l) => set({ location: l }),
      setLocationDetected: (v) => set({ locationDetected: v }),
      setHydrated: () => set({ _hasHydrated: true }),
      toggleNotify: (productId) => {
        const list = get().notifiedProducts;
        if (list.includes(productId)) set({ notifiedProducts: list.filter((x) => x !== productId) });
        else set({ notifiedProducts: [...list, productId] });
      },

      addToCart: (product, qty = 1) => {
        // Block adding out-of-stock products to cart
        if (!product.inStock) return;
        const cart = [...get().cart];
        const idx = cart.findIndex((i) => i.productId === product.id);
        if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
        else cart.push({ productId: product.id, qty });
        set({ cart });
      },
      incQty: (productId) => {
        const cart = get().cart.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + 1 } : i
        );
        set({ cart });
      },
      decQty: (productId) => {
        let cart = get().cart.map((i) =>
          i.productId === productId ? { ...i, qty: Math.max(0, i.qty - 1) } : i
        );
        cart = cart.filter((i) => i.qty > 0);
        set({ cart });
      },
      setQty: (productId, qty) => {
        let cart = get().cart.map((i) =>
          i.productId === productId ? { ...i, qty: Math.max(0, qty) } : i
        );
        cart = cart.filter((i) => i.qty > 0);
        set({ cart });
      },
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.productId !== productId) }),
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      moveToWishlist: (productId) => {
        const w = get().wishlist;
        if (!w.includes(productId)) set({ wishlist: [productId, ...w] });
        set({ cart: get().cart.filter((i) => i.productId !== productId) });
      },

      toggleWishlist: (productId) => {
        const w = get().wishlist;
        if (w.includes(productId)) set({ wishlist: w.filter((x) => x !== productId) });
        else set({ wishlist: [productId, ...w] });
      },
      removeFromWishlist: (productId) =>
        set({ wishlist: get().wishlist.filter((x) => x !== productId) }),
      wishlistToCart: (productId) => {
        const p = get().cart.find((i) => i.productId === productId);
        if (p) set({ cart: get().cart.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i) });
        else set({ cart: [...get().cart, { productId, qty: 1 }] });
        set({ wishlist: get().wishlist.filter((x) => x !== productId) });
      },

      applyCoupon: (c) => {
        const subtotal = cartSubtotal(get());
        if (subtotal < c.minOrder) return false;
        set({ appliedCoupon: { ...c, _id: c.code } });
        return true;
      },
      removeCoupon: () => set({ appliedCoupon: null }),

      login: (u) => set({ user: u }),
      signup: (u) => set({ user: u }),
      logout: () => set({ user: null, accountOpen: false }),

      loginWithCredentials: async (email, password) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) { throw new Error(data.error || "Login failed"); }
          set({ user: data.user });
          return true;
        } catch { return false; }
      },

      signupWithCredentials: async (data) => {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const result = await res.json();
          if (!res.ok) { throw new Error(result.error || "Signup failed"); }
          set({ user: result.user });
          return true;
        } catch { return false; }
      },

      logoutApi: async () => {
        try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* ignore */ }
        set({ user: null, accountOpen: false });
      },

      restoreSession: async () => {
        try {
          const res = await fetch("/api/auth/me");
          const data = await res.json();
          if (data.user) {
            // Real server session — sync the local store
            set({ user: data.user });
          } else {
            // No server session — clear any stale local-only user (e.g. old simulated logins)
            // so checkout doesn't think the user is logged in when the server doesn't.
            if (get().user) set({ user: null });
          }
        } catch { /* ignore */ }
      },

      addAddress: (a) => set({ addresses: [...get().addresses, a] }),
      removeAddress: (id) => set({ addresses: get().addresses.filter((a) => a.id !== id) }),

      placeOrder: async ({ address, slot, paymentMethod, paymentLabel }) => {
        const state = get();
        const items = state.cart;
        if (items.length === 0) return null;

        // Save to database via API (prices resolved server-side from DB for accuracy)
        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
              address,
              slot,
              paymentMethod,
              paymentLabel,
              discount: state.appliedCoupon ? (
                state.appliedCoupon.type === "flat" ? state.appliedCoupon.value :
                Math.min(state.appliedCoupon.maxDiscount ?? Infinity, Math.round((cartSubtotal(state) * state.appliedCoupon.value) / 100))
              ) : 0,
            }),
          });
          if (!res.ok) {
            if (res.status === 401) {
              // Session expired or not logged in on the server — clear stale local user
              set({ user: null });
              throw new Error("Please login to place your order");
            }
            throw new Error("Order failed");
          }
          const dbOrder = await res.json();
          const order = dbOrder.order;
          // Convert DB order shape to local Order type
          const localOrder: Order = {
            id: order.shortId || order.id,
            items: order.items.map((i: Record<string, unknown>) => ({
              productId: i.productId as string,
              name: i.name as string,
              price: i.price as number,
              qty: i.qty as number,
              emoji: i.emoji as string,
              gradient: i.gradient as string,
              unit: i.unit as string,
            })),
            subtotal: order.subtotal,
            tax: order.tax,
            delivery: order.delivery,
            discount: order.discount,
            total: order.total,
            address,
            slot,
            paymentMethod,
            paymentLabel,
            status: order.status,
            placedAt: new Date(order.placedAt).getTime(),
            etaMins: order.etaMins,
          };
          set({
            orders: [localOrder, ...state.orders],
            cart: [],
            appliedCoupon: null,
            lastOrder: localOrder,
            cartOpen: false,
            checkoutOpen: false,
          });
          return { order: localOrder };
        } catch (err) {
          return { order: null, error: err instanceof Error ? err.message : "Could not place order" };
        }
      },

      cancelOrder: (orderId) =>
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status: "Cancelled" } : o
          ),
        }),

      reorder: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        const cart = [...get().cart];
        order.items.forEach((oi) => {
          const idx = cart.findIndex((i) => i.productId === oi.productId);
          if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + oi.qty };
          else cart.push({ productId: oi.productId, qty: oi.qty });
        });
        set({ cart, cartOpen: true });
      },
    }),
    {
      name: "karto-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        user: s.user,
        orders: s.orders,
        addresses: s.addresses,
        appliedCoupon: s.appliedCoupon,
        location: s.location,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// ===== Selectors / derived helpers =====
// Uses the live products store (DB-backed) with static fallback.
function getLiveProductMap() {
  return useProductsStore.getState().productMap;
}

export function cartSubtotal(state: StoreState): number {
  const pm = getLiveProductMap();
  return state.cart.reduce((s, i) => {
    const p = pm[i.productId];
    return p ? s + p.price * i.qty : s;
  }, 0);
}

export function cartCount(state: StoreState): number {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

export function cartTotals(state: StoreState) {
  const subtotal = cartSubtotal(state);
  const tax = computeTax(subtotal);
  const delivery = computeDelivery(subtotal);
  let discount = 0;
  if (state.appliedCoupon && subtotal >= state.appliedCoupon.minOrder) {
    const c = state.appliedCoupon;
    if (c.type === "flat") discount = c.value;
    else discount = Math.min(c.maxDiscount ?? Infinity, Math.round((subtotal * c.value) / 100));
  }
  const total = Math.max(0, subtotal + tax + delivery - discount);
  const savings = state.cart.reduce((s, i) => {
    const p = getLiveProductMap()[i.productId];
    return p ? s + (p.mrp - p.price) * i.qty : s;
  }, 0);
  return { subtotal, tax, delivery, discount, total, savings };
}

export { DELIVERY_FEE, TAX_RATE, computeDelivery, computeTax };
