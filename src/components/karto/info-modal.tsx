"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Mail, Phone, Target, Eye, Heart, Users, Award, Truck, Shield } from "lucide-react";
import { useStore } from "@/components/karto/store";
import { useHydrated } from "@/components/karto/store-provider";

const CONTENT: Record<string, { title: string; subtitle?: string; body: React.ReactNode }> = {
  about: {
    title: "About Karto",
    subtitle: "Your everyday shopping partner",
    body: (
      <div className="space-y-5">
        <div>
          <h3 className="mb-1.5 flex items-center gap-2 text-base font-bold"><Target className="h-5 w-5 text-karto-green" /> Our Mission</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            To make everyday shopping effortless by delivering fresh groceries and daily essentials to your doorstep in minutes — at the best prices, every single day.
          </p>
        </div>
        <div>
          <h3 className="mb-1.5 flex items-center gap-2 text-base font-bold"><Eye className="h-5 w-5 text-karto-green" /> Our Vision</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            To become India&apos;s most trusted quick-commerce platform, where every household can rely on us for quality, speed and value.
          </p>
        </div>
        <div>
          <h3 className="mb-1.5 flex items-center gap-2 text-base font-bold"><Heart className="h-5 w-5 text-karto-green" /> Our Values</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Clock, label: "Speed", desc: "10-min delivery" },
              { icon: Shield, label: "Quality", desc: "100% fresh" },
              { icon: Truck, label: "Convenience", desc: "Free delivery ₹199+" },
              { icon: Award, label: "Value", desc: "Best prices" },
            ].map((v) => (
              <div key={v.label} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5">
                <v.icon className="h-5 w-5 text-karto-green" />
                <div><p className="text-sm font-bold">{v.label}</p><p className="text-[11px] text-muted-foreground">{v.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-karto-green/10 p-4 text-center">
          <div><p className="text-2xl font-black text-karto-green">10 min</p><p className="text-[11px] text-muted-foreground">Avg delivery</p></div>
          <div><p className="text-2xl font-black text-karto-green">1000+</p><p className="text-[11px] text-muted-foreground">Products</p></div>
          <div><p className="text-2xl font-black text-karto-green">5L+</p><p className="text-[11px] text-muted-foreground">Customers</p></div>
        </div>
        <div>
          <h3 className="mb-1.5 flex items-center gap-2 text-base font-bold"><Users className="h-5 w-5 text-karto-green" /> Our Team</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We&apos;re a passionate team of engineers, supply-chain experts and delivery partners working around the clock to bring you the fastest, freshest shopping experience. Based at MIT ADT University, Pune.
          </p>
        </div>
      </div>
    ),
  },
  cancellation: {
    title: "Cancellation Policy",
    subtitle: "Cancel anytime before dispatch",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>You can cancel your order anytime before it is marked &quot;Out for Delivery&quot; — completely free of charge.</p>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="font-bold text-foreground">How to cancel:</p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-5">
            <li>Go to <span className="font-semibold">My Account → Orders</span></li>
            <li>Find your order and click <span className="font-semibold">Cancel</span></li>
            <li>Confirm the cancellation</li>
          </ol>
        </div>
        <p>For prepaid orders, the refund is initiated within 3–5 business days to the original payment method. Cash on Delivery orders require no refund.</p>
        <p>Once an order is &quot;Out for Delivery&quot;, it cannot be cancelled but can be returned after delivery if there&apos;s a quality issue.</p>
      </div>
    ),
  },
  returns: {
    title: "Returns & Refunds",
    subtitle: "Easy returns within 24 hours",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>We offer easy returns and instant refunds for any quality issue. If you receive a damaged, expired or incorrect product, we&apos;ll make it right.</p>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="font-bold text-foreground">Return eligibility:</p>
          <ul className="mt-1.5 space-y-1 pl-1">
            <li>• Report within <span className="font-semibold">24 hours</span> of delivery</li>
            <li>• Product must be unused (for non-perishables)</li>
            <li>• Keep the original packaging if possible</li>
          </ul>
        </div>
        <p><span className="font-semibold text-foreground">Refund process:</span> Approved refunds are processed within 3–5 business days. For UPI/Card payments, the amount is credited back to the original source. For COD, store credits are issued.</p>
        <p>To request a return, go to <span className="font-semibold">My Account → Orders</span> and report the issue, or contact our support team.</p>
      </div>
    ),
  },
  "track-order": {
    title: "Track Your Order",
    subtitle: "Real-time order tracking",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>You can track your order in real-time from your account dashboard.</p>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="font-bold text-foreground">Order status flow:</p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-5">
            <li><span className="font-semibold">Placed</span> — Order received</li>
            <li><span className="font-semibold">Confirmed</span> — Being prepared</li>
            <li><span className="font-semibold">Out for Delivery</span> — On the way</li>
            <li><span className="font-semibold">Delivered</span> — Enjoy your order!</li>
          </ol>
        </div>
        <p>To track your order, go to <span className="font-semibold">My Account → Orders</span> and view the live progress bar. You&apos;ll also receive notifications at each step.</p>
      </div>
    ),
  },
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Quick answers to common questions",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {[
          { q: "How fast is Karto delivery?", a: "Most orders arrive within 10–30 minutes depending on your location and slot. Express delivery is available in under 30 minutes." },
          { q: "What is the minimum order value?", a: "There is no minimum order. Free delivery is available on orders above ₹199; a nominal ₹25 fee applies below that." },
          { q: "Which payment methods are accepted?", a: "UPI, Credit/Debit Cards, Net Banking, Wallets and Cash on Delivery. All online payments are secured." },
          { q: "Can I cancel or modify my order?", a: "Yes, you can cancel before it is marked 'Out for Delivery' from your account." },
          { q: "What if I receive a damaged product?", a: "Report it within 24 hours of delivery for an easy return and instant refund." },
        ].map((f, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <p className="font-bold text-foreground">{f.q}</p>
            <p className="mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    ),
  },
};

export function InfoModal() {
  const content = useStore((s) => s.infoModalContent);
  const setContent = useStore((s) => s.setInfoModalContent);
  const setContactOpen = useStore((s) => s.setContactOpen);
  const hydrated = useHydrated();

  const data = content ? CONTENT[content] : null;

  const handleClose = () => setContent(null);

  const handleContactClick = () => {
    setContent(null);
    setContactOpen(true);
  };

  return (
    <AnimatePresence>
      {hydrated && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[92] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-background shadow-2xl"
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 p-5 backdrop-blur">
              <div>
                <h2 className="text-xl font-black">{data.title}</h2>
                {data.subtitle && <p className="text-sm text-muted-foreground">{data.subtitle}</p>}
              </div>
              <button onClick={handleClose} className="rounded-lg p-2 hover:bg-muted" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* body */}
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {data.body}

              {/* contact CTA */}
              <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-bold">Still have questions?</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Our support team is available 24x7</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-karto-green" /> +91-8208353925</span>
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-karto-green" /> support@karto.shop</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-karto-green" /> MIT ADT University, Pune</span>
                </div>
                <button
                  onClick={handleContactClick}
                  className="mt-3 w-full rounded-full bg-karto-green py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
