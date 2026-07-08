/**
 * Lightweight Google Analytics 4 utility.
 * Reads the Measurement ID from NEXT_PUBLIC_GA_MEASUREMENT_ID.
 * Gracefully no-ops when gtag is unavailable (e.g. dev, ad-blockers).
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export function isGAEnabled(): boolean {
  return typeof window !== "undefined" && GA_MEASUREMENT_ID.length > 0 && typeof (window as any).gtag === "function";
}

type GAEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

export function trackEvent({ action, category, label, value }: GAEvent) {
  if (!isGAEnabled()) return;
  (window as any).gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackPageView(url: string) {
  if (!isGAEnabled()) return;
  (window as any).gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

// Convenience wrappers for the events required by the spec
export const analytics = {
  pageView: (url: string) => trackPageView(url),
  buttonClick: (label: string) => trackEvent({ action: "button_click", category: "engagement", label }),
  search: (query: string) => trackEvent({ action: "search", category: "search", label: query }),
  addToCart: (productId: string, value?: number) => trackEvent({ action: "add_to_cart", category: "ecommerce", label: productId, value }),
  removeFromCart: (productId: string) => trackEvent({ action: "remove_from_cart", category: "ecommerce", label: productId }),
  checkoutStarted: (value: number) => trackEvent({ action: "begin_checkout", category: "ecommerce", value }),
  purchaseCompleted: (orderId: string, value: number) => trackEvent({ action: "purchase", category: "ecommerce", label: orderId, value }),
  categoryClick: (categoryId: string) => trackEvent({ action: "select_content", category: "category", label: categoryId }),
  productClick: (productId: string) => trackEvent({ action: "select_item", category: "product", label: productId }),
  contactFormSubmitted: () => trackEvent({ action: "generate_lead", category: "contact" }),
  newsletterSubscribed: () => trackEvent({ action: "newsletter_subscribe", category: "engagement" }),
  login: () => trackEvent({ action: "login", category: "auth" }),
  signup: () => trackEvent({ action: "sign_up", category: "auth" }),
  wishlist: (productId: string) => trackEvent({ action: "add_to_wishlist", category: "engagement", label: productId }),
};
