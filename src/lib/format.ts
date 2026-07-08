/** Format a number as Indian Rupee currency */
export function formatPrice(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/** Compute tax (5% GST on items) */
export const TAX_RATE = 0.05;
export function computeTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE);
}

/** Free delivery threshold */
export const FREE_DELIVERY_THRESHOLD = 199;
export const DELIVERY_FEE = 25;

export function computeDelivery(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

/** Estimated delivery message */
export function estimatedDelivery(mins: number): string {
  return `${mins}–${mins + 5} mins`;
}

/** Generate a random order id like KTO-XXXX-XXXX */
export function generateOrderId(): string {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KTO-${seg()}-${seg()}`;
}

/** Estimated delivery date string */
export function estimatedDeliveryDate(days = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/** Mask a card number */
export function maskCard(num: string): string {
  const clean = num.replace(/\s/g, "");
  if (clean.length < 4) return clean;
  return "•••• •••• •••• " + clean.slice(-4);
}

/** Validate card number (Luhn-ish basic check) */
export function validateCardNumber(num: string): boolean {
  const clean = num.replace(/\s/g, "");
  return /^[\d]{15,16}$/.test(clean);
}
export function validateExpiry(exp: string): boolean {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
}
export function validateCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}
export function validatePincode(p: string): boolean {
  return /^[1-9]\d{5}$/.test(p);
}
export function validatePhone(p: string): boolean {
  return /^[6-9]\d{9}$/.test(p);
}
export function validateEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
