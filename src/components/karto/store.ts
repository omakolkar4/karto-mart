"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/data/products";
import { productMap } from "@/data/products";
import type { Coupon } from "@/data/extras";
import {
  computeTax,
  computeDelivery,
  DELIVERY_FEE,
  generateOrderId,
  TAX_RATE,
} from "@/lib/format";

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

  // addresses
  addAddress: (a: Address) => void;
  removeAddress: (id: string) => void;

  // orders
  placeOrder: (data: { address: Address; slot: string; paymentMethod: string; paymentLabel: string }) => Order | null;
  cancelOrder: (orderId: string) => void;
  reorder: (orderId: string) => void;
};

const DEFAULT_LOCATION = "Bandra West, Mumbai 400050";

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

      addAddress: (a) => set({ addresses: [...get().addresses, a] }),
      removeAddress: (id) => set({ addresses: get().addresses.filter((a) => a.id !== id) }),

      placeOrder: ({ address, slot, paymentMethod, paymentLabel }) => {
        const state = get();
        const items = state.cart;
        if (items.length === 0) return null;
        const orderItems: OrderItem[] = items.map((i) => {
          const p = productMap[i.productId];
          return {
            productId: p.id,
            name: p.name,
            price: p.price,
            qty: i.qty,
            emoji: p.emoji,
            gradient: p.gradient,
            unit: p.unit,
          };
        });
        const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
        const tax = computeTax(subtotal);
        const delivery = computeDelivery(subtotal);
        let discount = 0;
        const coupon = state.appliedCoupon;
        if (coupon) {
          if (coupon.type === "flat") discount = coupon.value;
          else discount = Math.min(coupon.maxDiscount ?? Infinity, Math.round((subtotal * coupon.value) / 100));
        }
        const total = Math.max(0, subtotal + tax + delivery - discount);
        const etaMins = orderItems.reduce((m, i) => {
          const p = productMap[i.productId];
          return Math.max(m, p.deliveryMins);
        }, 15);
        const order: Order = {
          id: generateOrderId(),
          items: orderItems,
          subtotal,
          tax,
          delivery,
          discount,
          total,
          address,
          slot,
          paymentMethod,
          paymentLabel,
          status: "Placed",
          placedAt: Date.now(),
          etaMins,
        };
        set({
          orders: [order, ...state.orders],
          cart: [],
          appliedCoupon: null,
          lastOrder: order,
          cartOpen: false,
          checkoutOpen: false,
        });
        return order;
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
export function cartSubtotal(state: StoreState): number {
  return state.cart.reduce((s, i) => {
    const p = productMap[i.productId];
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
    const p = productMap[i.productId];
    return p ? s + (p.mrp - p.price) * i.qty : s;
  }, 0);
  return { subtotal, tax, delivery, discount, total, savings };
}

export { DELIVERY_FEE, TAX_RATE, computeDelivery, computeTax };
