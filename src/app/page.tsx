"use client";

import { useMemo } from "react";
import { Header } from "@/components/karto/header";
import { Hero } from "@/components/karto/hero";
import { CategoryStrip } from "@/components/karto/category-strip";
import { ProductRail } from "@/components/karto/product-rail";
import { FlashSale } from "@/components/karto/flash-sale";
import { CategoryPage } from "@/components/karto/category-page";
import {
  Brands, Stats, Offers, BestDeals,
} from "@/components/karto/marketing-sections";
import { Footer } from "@/components/karto/footer";
import { CartDrawer } from "@/components/karto/cart-drawer";
import { WishlistDrawer } from "@/components/karto/wishlist-drawer";
import { SearchModal } from "@/components/karto/search-modal";
import { ProductModal } from "@/components/karto/product-modal";
import { AuthModal } from "@/components/karto/auth-modal";
import { CheckoutModal } from "@/components/karto/checkout-modal";
import { OrderSuccessModal } from "@/components/karto/order-success-modal";
import { AccountModal } from "@/components/karto/account-modal";
import { ContactModal } from "@/components/karto/contact-modal";
import { LocationModal } from "@/components/karto/location-modal";
import { InfoModal } from "@/components/karto/info-modal";
import { CategoriesDrawer } from "@/components/karto/categories-drawer";
import { ErrorBoundary } from "@/components/karto/error-boundary";
import { useStore } from "@/components/karto/store";
import { useProductsStore } from "@/lib/products-store";

export default function Home() {
  const view = useStore((s) => s.view);
  const products = useProductsStore((s) => s.products);

  const featured = useMemo(() => products.filter((p) => p.isFeatured), [products]);
  const bestSellers = useMemo(() => products.filter((p) => p.isBestSeller), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.isNew), [products]);
  const todaysOffers = useMemo(() => products.filter((p) => p.mrp > p.price).sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)).slice(0, 10), [products]);

  return (
    <div className="flex min-h-screen flex-col">
      <ErrorBoundary>
        <Header />
        <main className="flex-1">
          {view === "category" ? (
            // CATEGORY VIEW — dedicated page for the selected category (like Zepto)
            <CategoryPage />
          ) : (
            // HOME VIEW — trends, deals, best sellers (no full catalog)
            <>
              <Hero />

              {/* Best deals promo strip — right at the top */}
              <BestDeals />

              <CategoryStrip />

              {bestSellers.length > 0 && (
                <ProductRail
                  id="bestsellers"
                  eyebrow="Most loved"
                  title="Best Sellers"
                  subtitle="Top-rated products flying off our shelves"
                  products={bestSellers}
                />
              )}

              <FlashSale />

              {featured.length > 0 && (
                <ProductRail
                  id="featured"
                  eyebrow="Handpicked for you"
                  title="Featured Products"
                  subtitle="Trending favourites our customers love right now"
                  products={featured}
                />
              )}

              {newArrivals.length > 0 && (
                <ProductRail
                  id="new-arrivals"
                  eyebrow="Just landed"
                  title="New Arrivals"
                  subtitle="Fresh additions to the Karto catalog"
                  products={newArrivals}
                />
              )}

              <Offers />

              {todaysOffers.length > 0 && (
                <ProductRail
                  id="today-offers"
                  eyebrow="Save big today"
                  title="Today's Offers"
                  subtitle="Biggest discounts on everyday essentials"
                  products={todaysOffers}
                />
              )}

              <Brands />
              <Stats />
            </>
          )}
        </main>

        <Footer />

        {/* Overlays */}
        <CategoriesDrawer />
        <CartDrawer />
        <WishlistDrawer />
        <SearchModal />
        <ProductModal />
        <AuthModal />
        <CheckoutModal />
        <OrderSuccessModal />
        <AccountModal />
        <ContactModal />
        <LocationModal />
        <InfoModal />
      </ErrorBoundary>
    </div>
  );
}
