export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  title: string;
  text: string;
  location: string;
  date: string;
};

export const reviews: Review[] = [
  { id: "r1", name: "Ananya Sharma", avatar: "👩🏽", rating: 5, title: "Lightning fast delivery!", text: "Ordered fruits and dairy at 9 PM and got everything in 12 minutes. The quality was top-notch. Karto has become my go-to for daily groceries.", location: "Mumbai", date: "2 days ago" },
  { id: "r2", name: "Rohan Mehta", avatar: "👨🏻", rating: 5, title: "Best prices in the city", text: "I compared prices with 3 other apps and Karto was consistently cheaper. The flash sale section is a steal. Highly recommend!", location: "Bengaluru", date: "5 days ago" },
  { id: "r3", name: "Priya Nair", avatar: "👩🏾", rating: 4, title: "Fresh and well packed", text: "Vegetables were farm fresh and neatly packed. The delivery rider was polite. Only wish they had more organic options.", location: "Pune", date: "1 week ago" },
  { id: "r4", name: "Arjun Kapoor", avatar: "🧑🏽", rating: 5, title: "Lifesaver for late nights", text: "Needed medicines and snacks at 2 AM and Karto delivered. The app is super easy to use. Customer support is responsive too.", location: "Delhi", date: "1 week ago" },
  { id: "r5", name: "Sneha Reddy", avatar: "👩🏼", rating: 5, title: "Love the baby care range", text: "As a new mom, having baby essentials delivered in minutes is a blessing. The diapers and wipes are always in stock. Thank you Karto!", location: "Hyderabad", date: "2 weeks ago" },
  { id: "r6", name: "Vikram Singh", avatar: "👨🏽‍🦱", rating: 4, title: "Great app, smooth checkout", text: "The checkout flow is seamless and the coupons actually work. Saved ₹150 on my first order. Delivery slots are flexible.", location: "Gurugram", date: "2 weeks ago" },
];

export type Coupon = {
  code: string;
  title: string;
  description: string;
  type: "flat" | "percent";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  color: string;
};

export const coupons: Coupon[] = [
  { code: "KARTO50", title: "₹50 OFF", description: "Get ₹50 off on orders above ₹299", type: "flat", value: 50, minOrder: 299, color: "from-green-500 to-emerald-600" },
  { code: "FRESH100", title: "₹100 OFF", description: "Flat ₹100 off on orders above ₹599", type: "flat", value: 100, minOrder: 599, color: "from-emerald-500 to-teal-600" },
  { code: "KARTO20", title: "20% OFF", description: "Up to ₹150 off on first order", type: "percent", value: 20, minOrder: 399, maxDiscount: 150, color: "from-lime-500 to-green-600" },
  { code: "WEEKEND15", title: "15% OFF", description: "Weekend special — up to ₹200 off", type: "percent", value: 15, minOrder: 499, maxDiscount: 200, color: "from-yellow-500 to-amber-600" },
];

export type Brand = { name: string; emoji: string };
export const popularBrands: Brand[] = [
  { name: "Farm Fresh", emoji: "🌾" },
  { name: "Pure Daily", emoji: "🥛" },
  { name: "Crunch & Co.", emoji: "🍿" },
  { name: "Sip Well", emoji: "🥤" },
  { name: "BakeHouse", emoji: "🥖" },
  { name: "GlowUp", emoji: "✨" },
  { name: "Tiny Tots", emoji: "🍼" },
  { name: "SparkleClean", emoji: "🧽" },
  { name: "FrostBite", emoji: "🧊" },
  { name: "QuickBowl", emoji: "🍜" },
  { name: "MediPlus", emoji: "💊" },
  { name: "PawNest", emoji: "🐾" },
];
