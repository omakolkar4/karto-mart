"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, User, MapPin, Menu, X, Moon, Sun, ChevronDown, Phone, Navigation, Loader2,
} from "lucide-react";
import { useStore } from "@/components/karto/store";
import { categories } from "@/data/categories";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";
import { detectLocation } from "@/lib/geo";
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
  const selectedCategory = useStore((s) => s.selectedCategory);
  const setSelectedCategory = useStore((s) => s.setSelectedCategory);
  const location = useStore((s) => s.location);
  const setLocation = useStore((s) => s.setLocation);
  const { theme, setTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  // Stable search placeholder to avoid hydration mismatch; rotated client-side only.
  const [placeholder, setPlaceholder] = useState("fresh fruits");

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const result = await detectLocation();
      setLocation(result.short);
      toast.success("Location detected", { description: result.short, duration: 2500 });
    } catch (err) {
      toast.error("Couldn't detect location", {
        description: err instanceof Error ? err.message : "Please enable location permission.",
      });
    } finally {
      setDetecting(false);
    }
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const ideas = ["fresh fruits", "milk", "bananas", "chips", "bread", "chocolate", "onions", "coffee", "diapers", "paneer"];
    setPlaceholder(ideas[Math.floor(Math.random() * ideas.length)]);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(selectedCategory === catId ? null : catId);
    analytics.categoryClick(catId);
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
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
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-6">
          {/* mobile menu */}
          <button
            className="rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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

          {/* location */}
          <button
            onClick={handleDetect}
            disabled={detecting}
            className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-muted disabled:opacity-60 lg:flex"
            aria-label="Detect my location"
          >
            {detecting ? <Loader2 className="h-4 w-4 animate-spin text-karto-green" /> : <MapPin className="h-4 w-4 text-karto-green" />}
            <div className="leading-tight">
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Deliver to <Navigation className="h-2.5 w-2.5" />
              </p>
              <p className="flex max-w-44 items-center gap-1 truncate text-xs font-semibold">
                {detecting ? "Detecting..." : location} {!detecting && <ChevronDown className="h-3 w-3" />}
              </p>
            </div>
          </button>

          {/* search (desktop) — inline input that carries the query into the search modal */}
          <form
            onSubmit={(e) => { e.preventDefault(); openSearch(headerQuery); }}
            className="group mx-1 flex h-11 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 transition hover:border-karto-green/50 focus-within:border-karto-green focus-within:shadow-sm"
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

        {/* category nav (desktop) — horizontally scrollable, compact */}
        <nav className="hidden border-t border-border md:block">
          <div className="hide-scrollbar mx-auto flex max-w-7xl items-center gap-0.5 overflow-x-auto px-4 py-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition",
                  selectedCategory === c.id
                    ? "bg-karto-green/10 text-karto-green"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="text-sm">{c.emoji}</span>
                {c.short}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("catalog")}
              className="ml-1 shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold text-karto-green hover:bg-karto-green/10"
            >
              All →
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[70] bg-black/40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-[71] flex h-full w-72 flex-col bg-background shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-karto-green font-black text-white">K</span>
                  <span className="text-lg font-black">Kart<span className="text-karto-green">o</span></span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 border-b border-border p-4 text-sm">
                <MapPin className="h-4 w-4 text-karto-green" />
                <span className="truncate font-medium">{location}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <button
                  onClick={() => { openSearch(); setMobileOpen(false); }}
                  className="mb-3 flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
                >
                  <Search className="h-4 w-4" /> Search products...
                </button>

                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Categories</p>
                <div className="grid grid-cols-1 gap-0.5">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryClick(c.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                        selectedCategory === c.id ? "bg-karto-green/10 text-karto-green" : "hover:bg-muted"
                      )}
                    >
                      <span className="text-lg">{c.emoji}</span> {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border p-3">
                <button
                  onClick={() => { if (user) setAccountOpen(true); else setAuthOpen(true); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <User className="h-4 w-4" /> {user ? "My Account" : "Login / Sign up"}
                </button>
                <button
                  onClick={() => { setContactOpen(true); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <Phone className="h-4 w-4" /> Help & Support
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
