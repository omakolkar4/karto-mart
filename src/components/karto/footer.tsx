"use client";

import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube, Send, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/data/categories";
import { useStore } from "@/components/karto/store";
import { analytics } from "@/lib/analytics";

export function Footer() {
  const navigateToCategory = useStore((s) => s.navigateToCategory);
  const navigateHome = useStore((s) => s.navigateHome);
  const setContactOpen = useStore((s) => s.setContactOpen);
  const [email, setEmail] = useState("");

  const scrollTo = (id: string) => {
    navigateHome();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const goToCat = (id: string) => {
    navigateToCategory(id);
    analytics.categoryClick(id);
  };

  return (
    <footer className="mt-auto border-t border-border bg-card">
      {/* top CTA strip */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <h3 className="text-lg font-bold">Get exclusive deals & updates</h3>
            <p className="text-sm text-muted-foreground">Join our newsletter — no spam, just savings.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              analytics.newsletterSubscribed();
              toast.success("Subscribed! 🎉");
              setEmail("");
            }}
            className="flex w-full max-w-sm gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-karto-green"
            />
            <button className="flex h-11 items-center gap-1.5 rounded-full bg-karto-green px-4 text-sm font-bold text-white transition hover:bg-karto-green/90">
              <Send className="h-4 w-4" /> Join
            </button>
          </form>
        </div>
      </div>

      {/* main */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-karto-green text-lg font-black text-white">K</span>
            <span className="text-2xl font-black">Kart<span className="text-karto-green">o</span></span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Your everyday shopping partner. Fresh groceries and daily essentials delivered to your door in minutes — at the best prices.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-karto-green" /> MIT ADT University, Pune, Maharashtra 412201</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-karto-green" /> support@karto.shop</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-karto-green" /> +91-8208363925</p>
          </div>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <button
                key={i}
                aria-label="Social media"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-karto-green hover:bg-karto-green/10 hover:text-karto-green"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <button onClick={() => goToCat(c.id)} className="transition hover:text-karto-green">{c.name}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><button onClick={() => scrollTo("offers")} className="transition hover:text-karto-green">Offers</button></li>
            <li><button onClick={() => scrollTo("flash-sale")} className="transition hover:text-karto-green">Flash Sale</button></li>
            <li><button onClick={() => setContactOpen(true)} className="transition hover:text-karto-green">Contact</button></li>
            <li><button onClick={() => goToCat("fruits")} className="transition hover:text-karto-green">All Products</button></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><button onClick={() => setContactOpen(true)} className="transition hover:text-karto-green">Customer Care</button></li>
            <li><button onClick={() => setContactOpen(true)} className="transition hover:text-karto-green">FAQs</button></li>
            <li><button onClick={() => setContactOpen(true)} className="transition hover:text-karto-green">Cancellation</button></li>
            <li><button onClick={() => setContactOpen(true)} className="transition hover:text-karto-green">Returns</button></li>
            <li><button onClick={() => setContactOpen(true)} className="transition hover:text-karto-green">Track Order</button></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Karto Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => setContactOpen(true)} className="hover:text-karto-green">Privacy Policy</button>
            <button onClick={() => setContactOpen(true)} className="hover:text-karto-green">Terms of Service</button>
            <button onClick={() => setContactOpen(true)} className="hover:text-karto-green">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
