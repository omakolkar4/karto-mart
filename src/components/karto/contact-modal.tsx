"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, Send, ChevronDown, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/components/karto/store";
import { validateEmail, validatePhone } from "@/lib/format";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "How fast is Karto delivery?", a: "Karto delivers in as little as 10 minutes for express slots. Most orders arrive within 10–30 minutes depending on your location and slot." },
  { q: "What is the minimum order value?", a: "There is no minimum order value. However, free delivery is available on orders above ₹199. A nominal fee of ₹25 applies below that." },
  { q: "Which payment methods are accepted?", a: "We accept UPI, Credit/Debit Cards, Net Banking, Wallets and Cash on Delivery. All online payments are secured with bank-grade encryption." },
  { q: "Can I cancel or modify my order?", a: "Yes, you can cancel an order from your account before it is marked 'Out for Delivery'. Refunds for prepaid orders are processed within 3–5 business days." },
  { q: "What if I receive a damaged or expired product?", a: "We offer easy returns and instant refunds for any quality issue. Just report it from your order details within 24 hours of delivery." },
  { q: "Do you deliver 24x7?", a: "Karto operates from 6 AM to 2 AM in most cities. Express late-night delivery is available for essentials and medicines in select areas." },
];

export function ContactModal() {
  const open = useStore((s) => s.contactOpen);
  const setOpen = useStore((s) => s.setContactOpen);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter your name");
    if (!validateEmail(form.email)) return toast.error("Enter a valid email");
    if (form.phone && !validatePhone(form.phone)) return toast.error("Enter a valid 10-digit phone");
    if (!form.subject.trim()) return toast.error("Please add a subject");
    if (form.message.trim().length < 10) return toast.error("Message should be at least 10 characters");

    setLoading(true);
    // In production this would POST to /api/contact and store in Firestore/Prisma.
    setTimeout(() => {
      setLoading(false);
      analytics.contactFormSubmitted();
      toast.success("Message sent! 🎉", { description: "Our team will get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setOpen(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[92] flex items-start justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="my-0 w-full max-w-4xl bg-background sm:my-4 sm:rounded-2xl sm:shadow-2xl"
          >
            <div className="relative bg-gradient-to-br from-karto-green to-emerald-600 p-6 text-white">
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-white/80 transition hover:bg-white/15" aria-label="Close"><X className="h-5 w-5" /></button>
              <h2 className="text-2xl font-black">Get in touch</h2>
              <p className="mt-1 text-sm text-white/90">We&apos;d love to help. Reach out anytime, 24x7.</p>
            </div>

            <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
              {/* form */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><MessageCircle className="h-5 w-5 text-karto-green" /> Send us a message</h3>
                <form onSubmit={submit} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="karto-input" placeholder="Your name" /></Field>
                    <Field label="Email *"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="karto-input" placeholder="you@example.com" /></Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="karto-input" placeholder="98765 43210" /></Field>
                    <Field label="Subject *"><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="karto-input" placeholder="How can we help?" /></Field>
                  </div>
                  <Field label="Message *"><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="karto-input resize-none" placeholder="Write your message..." /></Field>
                  <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-karto-green py-3 text-sm font-bold text-white transition hover:bg-karto-green/90 disabled:opacity-60">
                    {loading ? "Sending..." : <><Send className="h-4 w-4" /> Send Message</>}
                  </button>
                </form>

                {/* customer care */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[{ icon: Phone, label: "Call", value: "1800-200-KARTO" }, { icon: Mail, label: "Email", value: "support@karto.shop" }, { icon: Clock, label: "Hours", value: "24x7" }].map((c) => (
                    <div key={c.label} className="rounded-xl border border-border bg-card p-3">
                      <c.icon className="mx-auto h-5 w-5 text-karto-green" />
                      <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{c.label}</p>
                      <p className="text-xs font-bold">{c.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* map + faqs */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><MapPin className="h-5 w-5 text-karto-green" /> Our location</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Karto HQ"
                    src="https://www.google.com/maps?q=Bandra+West+Mumbai&output=embed"
                    className="h-44 w-full"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Karto HQ, Bandra West, Mumbai 400050, India</p>

                <h3 className="mb-2 mt-5 text-base font-bold">Frequently asked questions</h3>
                <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-2">
                  {FAQS.map((f, i) => (
                    <AccordionItem key={i} value={`f-${i}`} className="border-b border-border last:border-0">
                      <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
