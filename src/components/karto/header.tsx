"use client";

import { useEffect, useState } from "react";
import {
  Search, ShoppingCart, Heart, User, MapPin, Menu, X, Moon, Sun, ChevronDown, Phone,
} from "lucide-react";
import { useStore } from "@/components/karto/store";
import { categories } from "@/data/categories";
import { useTheme } from "next-themes";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Header() {
  const cartCount = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));
  const wishlistCount = useStore((s) => s.wishlist.length);
  const user = useStore((s) => s.user);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const openSearch = useStore((s) => s.openSearch);
  const setAuthOpen = useStore((s) => s.setAuthOpen);
  const setAccountOpen = useStore((s) => s.setAccountOpen);
  const setContactOpen = useStore((s) => s.setContactOpen);
  const location = useStore((s) => s.location);
  const setLocationModalOpen = useStore((s) => s.setLocationModalOpen);
  const setCategoriesDrawerOpen = useStore((s) => s.setCategoriesDrawerOpen);
  const navigateToCategory = useStore((s) => s.navigateToCategory);
  const navigateHome = useStore((s) => s.navigateHome);
  const view = useStore((s) => s.view);
  const activeCategory = useStore((s) => s.activeCategory);
  const { theme, setTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  // Stable search placeholder to avoid hydration mismatch; rotated client-side only.
  const [placeholder, setPlaceholder] = useState("fresh fruits");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const ideas = ["fresh fruits", "milk", "bananas", "chips", "bread", "chocolate", "onions", "coffee", "diapers", "paneer"];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaceholder(ideas[Math.floor(Math.random() * ideas.length)]);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCategoryClick = (catId: string) => {
    navigateToCategory(catId);
    analytics.categoryClick(catId);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg transition-shadow",
          scrolled && "shadow-sm"
        )}
      >
        {/* announcement strip */}
        <div className="bg-karto-green text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-medium sm:px-6">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-white/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Free delivery on orders above ₹199 · Express in 10 mins
            </span>
            <button
              onClick={() => setContactOpen(true)}
              className="hidden items-center gap-1 transition hover:opacity-80 sm:flex"
            >
              <Phone className="h-3 w-3" /> Help & Support
            </button>
          </div>
        </div>

        {/* main bar */}
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6">
          {/* hamburger menu — all screens, opens categories drawer */}
          <button
            className="rounded-lg p-2 text-foreground transition hover:bg-muted"
            onClick={() => setCategoriesDrawerOpen(true)}
            aria-label="All categories"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* logo */}
          <button
            onClick={() => navigateHome()}
            className="flex shrink-0 items-center gap-2"
            aria-label="Karto home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-karto-green text-lg font-black text-white shadow-sm">
              K
            </span>
            <span className="hidden text-xl font-black tracking-tight sm:block">
              Kart<span className="text-karto-green">o</span>
            </span>
          </button>

          {/* location — opens location modal */}
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-muted"
            aria-label="Choose location"
          >
            <MapPin className={cn("h-4 w-4 shrink-0", location ? "text-karto-green" : "text-amber-500")} />
            <div className="leading-tight">
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {location ? "Deliver to" : "Set location"} <ChevronDown className="h-2.5 w-2.5" />
              </p>
              <p className={cn("flex max-w-32 items-center gap-1 truncate text-xs font-semibold sm:max-w-44", !location && "text-amber-600")}>
                {location || "Tap to set location"}
              </p>
            </div>
          </button>

          {/* search — inline input that carries the query into the search modal */}
          <form
            onSubmit={(e) => { e.preventDefault(); openSearch(headerQuery); }}
            className="group mx-1 flex h-10 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 transition hover:border-karto-green/50 focus-within:border-karto-green focus-within:shadow-sm sm:h-11"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground group-focus-within:text-karto-green" />
            <input
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              placeholder={`Search "${placeholder}"...`}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search products"
            />
            {headerQuery && (
              <button type="button" onClick={() => setHeaderQuery("")} className="text-muted-foreground hover:text-foreground" aria-label="Clear">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* right actions */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative rounded-full p-2.5 transition hover:bg-muted"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => (user ? setAccountOpen(true) : setAuthOpen(true))}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-muted sm:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:block">{user ? user.name.split(" ")[0] : "Login"}</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2.5 transition hover:bg-muted"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full bg-karto-green px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-karto-green/90 active:scale-95"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:block">Cart</span>
              {mounted && cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-extrabold text-karto-green">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* category nav — horizontally scrollable, compact, premium tiles */}
        <nav className="hide-scrollbar hidden border-t border-border bg-gradient-to-b from-background to-muted/30 md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2">
            {categories.map((c) => {
              const isActive = view === "category" && activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.id)}
                  className={cn(
                    "group flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-karto-green text-white shadow-sm"
                      : "text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm"
                  )}
                >
                  <span className={cn("text-base transition-transform duration-200", !isActive && "group-hover:scale-125")}>{c.emoji}</span>
                  {c.short}
                </button>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}
