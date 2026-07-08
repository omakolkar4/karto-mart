"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Download, ShoppingBag, Clock, MapPin, Package } from "lucide-react";
import { useStore } from "@/components/karto/store";
import { formatPrice, estimatedDeliveryDate } from "@/lib/format";

export function OrderSuccessModal() {
  const order = useStore((s) => s.lastOrder);
  const setLastOrder = useStore((s) => s.setLastOrder);
  const setAccountOpen = useStore((s) => s.setAccountOpen);

  const close = () => setLastOrder(null);

  const downloadInvoice = () => {
    if (!order) return;
    const rows = order.items.map((i) => `  ${i.name} (${i.unit}) x${i.qty} = ${formatPrice(i.price * i.qty)}`).join("\n");
    const a = order.address;
    const invoice = `
============================================
              KARTO — TAX INVOICE
============================================
Order ID:     ${order.id}
Order Date:   ${new Date(order.placedAt).toLocaleString("en-IN")}
Status:       ${order.status}
ETA:          ~${order.etaMins} mins (${estimatedDeliveryDate()})
--------------------------------------------
DELIVER TO:
${a.fullName}
${a.house}, ${a.street}, ${a.area}
${a.city}, ${a.state} - ${a.pincode}
Phone: ${a.phone}
--------------------------------------------
ITEMS:
${rows}
--------------------------------------------
Subtotal:           ${formatPrice(order.subtotal)}
Taxes (5%):         ${formatPrice(order.tax)}
Delivery:           ${order.delivery === 0 ? "FREE" : formatPrice(order.delivery)}
Discount:           ${formatPrice(order.discount)}
--------------------------------------------
GRAND TOTAL:        ${formatPrice(order.total)}
============================================
Payment: ${order.paymentLabel}
Slot:    ${order.slot}

Thank you for shopping with Karto!
Your everyday shopping partner.
support@karto.shop · 1800-200-KARTO
============================================
`;
    const blob = new Blob([invoice], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Karto-Invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[96] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background shadow-2xl"
          >
            {/* success header */}
            <div className="relative bg-gradient-to-br from-karto-green to-emerald-600 p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
              <h2 className="mt-4 text-2xl font-black">Order Placed Successfully!</h2>
              <p className="mt-1 text-sm text-white/90">Your groceries are on the way 🛵</p>
            </div>

            <div className="p-6">
              {/* order info */}
              <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-bold">{order.id}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Estimated delivery</span><span className="flex items-center gap-1 font-bold text-karto-green"><Clock className="h-3.5 w-3.5" /> ~{order.etaMins} mins</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total paid</span><span className="font-bold">{formatPrice(order.total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-semibold">{order.paymentLabel}</span></div>
              </div>

              {/* progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1 text-karto-green"><Package className="h-3.5 w-3.5" /> Placed</span>
                  <span className="flex items-center gap-1">Confirmed</span>
                  <span className="flex items-center gap-1">Out for delivery</span>
                  <span className="flex items-center gap-1">Delivered</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div initial={{ width: "5%" }} animate={{ width: "25%" }} transition={{ delay: 0.3 }} className="h-full rounded-full bg-karto-green" />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-karto-green" />
                <span>Delivering to {order.address.area}, {order.address.city} - {order.address.pincode}</span>
              </div>

              {/* actions */}
              <div className="mt-5 flex flex-col gap-2">
                <button onClick={downloadInvoice} className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-karto-green py-3 text-sm font-bold text-karto-green transition hover:bg-karto-green/10">
                  <Download className="h-4 w-4" /> Download Invoice
                </button>
                <div className="flex gap-2">
                  <button onClick={() => { close(); }} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold transition hover:bg-muted">
                    <ShoppingBag className="h-4 w-4" /> Continue Shopping
                  </button>
                  <button onClick={() => { close(); setAccountOpen(true); }} className="flex-1 rounded-full bg-karto-green py-3 text-sm font-bold text-white transition hover:bg-karto-green/90">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
