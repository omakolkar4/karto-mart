export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  deliveryMins: number;
  inStock: boolean;
  stockCount: number;
  unit: string;
  emoji: string;
  gradient: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  isFeatured?: boolean;
};

export const brands = [
  "Farm Fresh", "Pure Daily", "Crunch & Co.", "Sip Well", "BakeHouse", "GlowUp",
  "Tiny Tots", "SparkleClean", "FrostBite", "QuickBowl", "MediPlus", "PawNest",
  "VoltEdge", "HomeNest", "Nature's Best", "Urban Harvest",
];

const g = (from: string, to: string) => `from-${from} to-${to}`;

// helper to compute discount from price/mrp
function p(
  id: string,
  name: string,
  brand: string,
  category: string,
  price: number,
  mrp: number,
  unit: string,
  emoji: string,
  gradient: string,
  description: string,
  opts: Partial<Product> = {}
): Product {
  const rating = opts.rating ?? Number((3.8 + Math.random() * 1.2).toFixed(1));
  const reviews = opts.reviews ?? Math.floor(40 + Math.random() * 1800);
  return {
    id,
    name,
    brand,
    category,
    price,
    mrp,
    rating,
    reviews,
    deliveryMins: opts.deliveryMins ?? [10, 12, 15, 20, 25][Math.floor(Math.random() * 5)],
    inStock: opts.inStock ?? Math.random() > 0.12,
    stockCount: opts.stockCount ?? Math.floor(5 + Math.random() * 60),
    unit,
    emoji,
    gradient,
    description,
    tags: opts.tags ?? [],
    isNew: opts.isNew,
    isBestSeller: opts.isBestSeller,
    isFlashSale: opts.isFlashSale,
    isFeatured: opts.isFeatured,
  };
}

export const products: Product[] = [
  // ===== FRUITS =====
  p("f1", "Royal Gala Apples", "Farm Fresh", "fruits", 189, 240, "1 kg", "🍎", g("rose-100", "red-50"), "Crisp, sweet Royal Gala apples hand-picked from the hills. Perfect for snacking or juices.", { isBestSeller: true, isFeatured: true, tags: ["organic", "sweet"] }),
  p("f2", "Cavendish Bananas", "Farm Fresh", "fruits", 59, 79, "1 dozen", "🍌", g("yellow-100", "amber-50"), "Naturally ripened bananas, rich in potassium and energy.", { isBestSeller: true, tags: ["energy"] }),
  p("f3", "Alphonso Mangoes", "Nature's Best", "fruits", 499, 650, "1 kg", "🥭", g("amber-100", "orange-50"), "The king of fruits — premium Ratnagiri Alphonso mangoes, sweet and aromatic.", { isFeatured: true, isNew: true, tags: ["seasonal"] }),
  p("f4", "Sweet Pomegranate", "Urban Harvest", "fruits", 149, 199, "500 g", "🍊", g("red-100", "rose-50"), "Juicy, ruby-red pomegranate arils loaded with antioxidants.", { tags: ["antioxidants"] }),
  p("f5", "Green Grapes", "Farm Fresh", "fruits", 129, 169, "500 g", "🍇", g("lime-100", "green-50"), "Seedless crunchy green grapes, refreshingly sweet.", { tags: ["seedless"] }),
  p("f6", "Kiwi Fruit", "Nature's Best", "fruits", 199, 259, "3 pcs", "🥝", g("green-100", "emerald-50"), "Imported kiwis packed with vitamin C and a tangy-sweet taste.", { isNew: true, tags: ["imported", "vitamin-c"] }),
  p("f7", "Sweet Strawberries", "Urban Harvest", "fruits", 249, 320, "250 g", "🍓", g("rose-100", "pink-50"), "Fresh, plump strawberries — perfect for desserts and smoothies.", { isFeatured: true, tags: ["seasonal"] }),
  p("f8", "Fresh Oranges", "Farm Fresh", "fruits", 99, 139, "1 kg", "🍊", g("orange-100", "amber-50"), "Juicy Nagpur oranges, a great source of vitamin C.", { tags: ["vitamin-c"] }),

  // ===== VEGETABLES =====
  p("v1", "Roma Tomatoes", "Urban Harvest", "vegetables", 39, 59, "1 kg", "🍅", g("red-100", "rose-50"), "Firm, fleshy Roma tomatoes ideal for curries and sauces.", { isBestSeller: true, tags: ["fresh"] }),
  p("v2", "Baby Spinach", "Farm Fresh", "vegetables", 49, 69, "250 g", "🥬", g("green-100", "emerald-50"), "Tender baby spinach leaves, washed and ready to use.", { isFeatured: true, tags: ["leafy", "iron"] }),
  p("v3", "Onions", "Farm Fresh", "vegetables", 35, 55, "1 kg", "🧅", g("rose-100", "red-50"), "Premium quality onions, a kitchen essential.", { isBestSeller: true, tags: ["essential"] }),
  p("v4", "Potatoes", "Urban Harvest", "vegetables", 29, 45, "1 kg", "🥔", g("amber-100", "yellow-50"), "All-purpose potatoes perfect for frying, boiling or baking.", { isBestSeller: true, tags: ["essential"] }),
  p("v5", "Broccoli", "Nature's Best", "vegetables", 79, 109, "300 g", "🥦", g("green-100", "emerald-50"), "Fresh green broccoli florets, rich in fibre and vitamins.", { tags: ["healthy"] }),
  p("v6", "Bell Peppers Mix", "Urban Harvest", "vegetables", 119, 159, "500 g", "🫑", g("lime-100", "green-50"), "Colourful tri-colour bell peppers — crunchy and sweet.", { isFeatured: true, tags: ["colourful"] }),
  p("v7", "Carrots", "Farm Fresh", "vegetables", 45, 65, "500 g", "🥕", g("orange-100", "amber-50"), "Sweet, crunchy carrots great for salads and juices.", { tags: ["vitamin-a"] }),
  p("v8", "Cucumber", "Urban Harvest", "vegetables", 29, 39, "500 g", "🥒", g("green-100", "emerald-50"), "Cool, crisp cucumbers — hydrating and refreshing.", { tags: ["hydrating"] }),

  // ===== DAIRY =====
  p("d1", "Full Cream Milk", "Pure Daily", "dairy", 64, 68, "1 L", "🥛", g("sky-100", "blue-50"), "Farm-fresh full cream milk, rich in calcium and protein.", { isBestSeller: true, isFeatured: true, tags: ["essential", "calcium"] }),
  p("d2", "Greek Yogurt", "Pure Daily", "dairy", 89, 110, "400 g", "🍶", g("blue-100", "sky-50"), "Thick, creamy Greek yogurt packed with protein.", { isBestSeller: true, tags: ["protein", "probiotic"] }),
  p("d3", "Cheddar Cheese Block", "Pure Daily", "dairy", 245, 299, "200 g", "🧀", g("amber-100", "yellow-50"), "Aged cheddar cheese with a sharp, bold flavour.", { tags: ["aged"] }),
  p("d4", "Unsalted Butter", "Pure Daily", "dairy", 275, 320, "200 g", "🧈", g("yellow-100", "amber-50"), "Creamy unsalted butter for cooking and baking.", { tags: ["baking"] }),
  p("d5", "Paneer", "Pure Daily", "dairy", 99, 129, "200 g", "🧀", g("orange-100", "amber-50"), "Soft, fresh cottage cheese — perfect for curries.", { isBestSeller: true, tags: ["protein"] }),
  p("d6", "Almond Milk", "Nature's Best", "dairy", 199, 240, "1 L", "🥛", g("stone-100", "amber-50"), "Unsweetened almond milk, dairy-free and lactose-free.", { isNew: true, tags: ["vegan", "lactose-free"] }),
  p("d7", "Fresh Cream", "Pure Daily", "dairy", 89, 109, "250 ml", "🍦", g("rose-100", "pink-50"), "Whipping-grade fresh cream for desserts and pasta.", { tags: ["baking"] }),

  // ===== SNACKS =====
  p("s1", "Salted Potato Chips", "Crunch & Co.", "snacks", 30, 40, "52 g", "🍟", g("amber-100", "yellow-50"), "Crispy, perfectly salted potato chips.", { isBestSeller: true, isFlashSale: true, tags: ["crispy"] }),
  p("s2", "Mixed Nuts Pack", "Nature's Best", "snacks", 349, 449, "200 g", "🥜", g("orange-100", "amber-50"), "Roasted almonds, cashews and pistachios — a protein-rich snack.", { isFeatured: true, tags: ["protein", "healthy"] }),
  p("s3", "Cheese Popcorn", "Crunch & Co.", "snacks", 45, 60, "70 g", "🍿", g("yellow-100", "amber-50"), "Fluffy popcorn with a cheesy twist.", { tags: ["cheesy"] }),
  p("s4", "Dark Chocolate Bar", "GlowUp", "snacks", 175, 220, "100 g", "🍫", g("stone-100", "amber-50"), "70% cocoa dark chocolate, rich and intense.", { isBestSeller: true, tags: ["dark", "antioxidants"] }),
  p("s5", "Nachos & Salsa", "Crunch & Co.", "snacks", 119, 149, "200 g", "🌽", g("yellow-100", "amber-50"), "Crunchy corn nachos with a tangy tomato salsa dip.", { tags: ["party"] }),
  p("s6", "Granola Bars", "Nature's Best", "snacks", 199, 260, "5 x 40 g", "🍪", g("amber-100", "yellow-50"), "Oats & honey granola bars for energy on the go.", { isNew: true, tags: ["energy", "oats"] }),
  p("s7", "Masala Peanuts", "Crunch & Co.", "snacks", 55, 75, "150 g", "🥜", g("orange-100", "amber-50"), "Spicy roasted masala peanuts — a tea-time favourite.", { tags: ["spicy"] }),

  // ===== BEVERAGES =====
  p("b1", "Orange Juice", "Sip Well", "beverages", 120, 150, "1 L", "🧃", g("orange-100", "amber-50"), "100% pure orange juice, no added sugar.", { isBestSeller: true, tags: ["no-sugar"] }),
  p("b2", "Sparkling Water", "Sip Well", "beverages", 89, 110, "750 ml", "💧", g("cyan-100", "sky-50"), "Refreshing sparkling mineral water with a hint of lime.", { tags: ["refreshing"] }),
  p("b3", "Energy Drink", "Sip Well", "beverages", 99, 125, "250 ml", "⚡", g("blue-100", "indigo-50"), "Boost your energy with this refreshing citrus drink.", { isFlashSale: true, tags: ["energy"] }),
  p("b4", "Cold Brew Coffee", "Sip Well", "beverages", 179, 220, "330 ml", "☕", g("stone-100", "amber-50"), "Smooth, low-acid cold brew coffee — ready to drink.", { isFeatured: true, isNew: true, tags: ["coffee"] }),
  p("b5", "Green Tea Bags", "Nature's Best", "beverages", 165, 210, "25 bags", "🍵", g("green-100", "emerald-50"), "Antioxidant-rich green tea for a calming brew.", { isBestSeller: true, tags: ["antioxidants", "calming"] }),
  p("b6", "Cola Can", "Sip Well", "beverages", 40, 50, "330 ml", "🥤", g("red-100", "rose-50"), "Chilled, fizzy cola — the classic refreshment.", { tags: ["fizzy"] }),
  p("b7", "Coconut Water", "Nature's Best", "beverages", 69, 89, "400 ml", "🥥", g("lime-100", "green-50"), "Naturally sweet tender coconut water, full of electrolytes.", { isFeatured: true, tags: ["electrolytes"] }),

  // ===== BAKERY =====
  p("ba1", "Whole Wheat Bread", "BakeHouse", "bakery", 45, 55, "400 g", "🍞", g("amber-100", "yellow-50"), "Soft whole wheat sandwich bread, baked fresh daily.", { isBestSeller: true, isFeatured: true, tags: ["whole-wheat"] }),
  p("ba2", "Butter Croissants", "BakeHouse", "bakery", 149, 199, "4 pcs", "🥐", g("yellow-100", "amber-50"), "Flaky, buttery croissants — a bakery classic.", { tags: ["breakfast"] }),
  p("ba3", "Chocolate Muffin", "BakeHouse", "bakery", 99, 129, "2 pcs", "🧁", g("amber-100", "orange-50"), "Moist double-chocolate muffins, baked fresh.", { tags: ["dessert"] }),
  p("ba4", "Bagels", "BakeHouse", "bakery", 159, 199, "4 pcs", "🥯", g("orange-100", "amber-50"), "Chewy New York-style bagels, perfect for toasting.", { isNew: true, tags: ["breakfast"] }),
  p("ba5", "Garlic Bread", "BakeHouse", "bakery", 89, 119, "200 g", "🥖", g("yellow-100", "amber-50"), "Cheesy garlic bread, ready to bake and serve.", { isBestSeller: true, tags: ["garlic"] }),
  p("ba6", "Donuts", "BakeHouse", "bakery", 199, 260, "6 pcs", "🍩", g("pink-100", "rose-50"), "Glazed rainbow donuts — soft, sweet and colourful.", { tags: ["dessert"] }),

  // ===== PERSONAL CARE =====
  p("pc1", "Vitamin C Face Wash", "GlowUp", "personal-care", 199, 299, "100 ml", "🧴", g("violet-100", "purple-50"), "Brightening face wash with vitamin C & niacinamide.", { isBestSeller: true, isFeatured: true, tags: ["skincare"] }),
  p("pc2", "Herbal Shampoo", "GlowUp", "personal-care", 249, 320, "340 ml", "🧴", g("purple-100", "violet-50"), "Sulfate-free herbal shampoo for healthy, shiny hair.", { tags: ["haircare", "sulfate-free"] }),
  p("pc3", "Toothpaste", "GlowUp", "personal-care", 75, 99, "150 g", "🪥", g("sky-100", "blue-50"), "Mint fresh toothpaste with cavity protection.", { isBestSeller: true, tags: ["dental"] }),
  p("pc4", "Body Lotion", "GlowUp", "personal-care", 275, 349, "400 ml", "🧴", g("pink-100", "rose-50"), "24-hour moisturising body lotion with shea butter.", { tags: ["moisturizer"] }),
  p("pc5", "Sunscreen SPF 50", "GlowUp", "personal-care", 399, 499, "50 ml", "🧴", g("amber-100", "yellow-50"), "Lightweight matte sunscreen with broad-spectrum SPF 50.", { isFeatured: true, isNew: true, tags: ["sunscreen"] }),
  p("pc6", "Hand Wash Refill", "GlowUp", "personal-care", 129, 169, "750 ml", "🧼", g("teal-100", "cyan-50"), "Antibacterial hand wash with a fresh citrus scent.", { tags: ["hygiene"] }),
  p("pc7", "Razor Pack", "GlowUp", "personal-care", 199, 259, "3 pcs", "🪒", g("slate-100", "zinc-50"), "Triple-blade razors with aloe strip for a smooth shave.", { tags: ["grooming"] }),

  // ===== BABY CARE =====
  p("bc1", "Baby Diapers", "Tiny Tots", "baby-care", 599, 799, "Medium 44 pcs", "🍼", g("pink-100", "rose-50"), "Soft, ultra-absorbent diapers with 12-hour dryness.", { isBestSeller: true, isFeatured: true, tags: ["essential"] }),
  p("bc2", "Baby Wipes", "Tiny Tots", "baby-care", 199, 249, "72 wipes", "🧻", g("rose-100", "pink-50"), "Gentle, alcohol-free wipes for sensitive baby skin.", { tags: ["gentle"] }),
  p("bc3", "Baby Formula", "Tiny Tots", "baby-care", 749, 899, "400 g", "🥛", g("blue-100", "sky-50"), "Stage-2 infant formula with DHA & essential nutrients.", { tags: ["nutrition"] }),
  p("bc4", "Baby Shampoo", "Tiny Tots", "baby-care", 225, 279, "200 ml", "🧴", g("violet-100", "purple-50"), "Tear-free, no-more-tears baby shampoo.", { tags: ["gentle"] }),
  p("bc5", "Baby Lotion", "Tiny Tots", "baby-care", 249, 319, "200 ml", "🧴", g("pink-100", "rose-50"), "Mild moisturising lotion for soft baby skin.", { isNew: true, tags: ["moisturizer"] }),
  p("bc6", "Baby Food Puree", "Tiny Tots", "baby-care", 199, 259, "2 x 100 g", "🥣", g("orange-100", "amber-50"), "Organic fruit & cereal puree for 6+ months.", { tags: ["organic"] }),

  // ===== CLEANING =====
  p("cl1", "Dishwash Liquid", "SparkleClean", "cleaning", 175, 220, "750 ml", "🧴", g("lime-100", "green-50"), "Powerful grease-cutting dishwash liquid with lime.", { isBestSeller: true, tags: ["essential"] }),
  p("cl2", "Floor Cleaner", "SparkleClean", "cleaning", 199, 259, "1 L", "🧹", g("emerald-100", "green-50"), "Disinfectant floor cleaner with a fresh pine scent.", { tags: ["disinfectant"] }),
  p("cl3", "Laundry Detergent", "SparkleClean", "cleaning", 399, 499, "2 kg", "🧺", g("sky-100", "blue-50"), "Front-load detergent powder for tough stains.", { isFeatured: true, tags: ["laundry"] }),
  p("cl4", "Toilet Cleaner", "SparkleClean", "cleaning", 99, 129, "500 ml", "🚽", g("cyan-100", "teal-50"), "Thick toilet cleaner that kills 99.9% germs.", { tags: ["disinfectant"] }),
  p("cl5", "Glass Cleaner", "SparkleClean", "cleaning", 89, 119, "500 ml", "🪟", g("blue-100", "sky-50"), "Streak-free shine glass & surface cleaner.", { tags: ["shine"] }),
  p("cl6", "Scrub Sponges", "SparkleClean", "cleaning", 79, 109, "4 pcs", "🧽", g("green-100", "emerald-50"), "Dual-sided scrub sponges for tough cleaning.", { tags: ["scrub"] }),

  // ===== FROZEN =====
  p("fr1", "Frozen Peas", "FrostBite", "frozen", 99, 129, "500 g", "🟢", g("green-100", "emerald-50"), "Sweet, flash-frozen garden peas — locked-in freshness.", { isBestSeller: true, tags: ["frozen"] }),
  p("fr2", "Veg Nuggets", "FrostBite", "frozen", 149, 199, "400 g", "🍗", g("amber-100", "yellow-50"), "Crispy veg nuggets, ready in 8 minutes.", { isFeatured: true, tags: ["ready-to-cook"] }),
  p("fr3", "Frozen French Fries", "FrostBite", "frozen", 119, 159, "750 g", "🍟", g("yellow-100", "amber-50"), "Golden, crispy fries — just fry and serve.", { isBestSeller: true, tags: ["ready-to-cook"] }),
  p("fr4", "Ice Cream Tub", "FrostBite", "frozen", 249, 320, "500 ml", "🍦", g("pink-100", "rose-50"), "Creamy vanilla bean ice cream, made with real milk.", { tags: ["dessert"] }),
  p("fr5", "Frozen Mixed Veggies", "FrostBite", "frozen", 129, 169, "500 g", "🥕", g("orange-100", "amber-50"), "Carrots, beans, corn & peas — diced and frozen.", { tags: ["frozen"] }),
  p("fr6", "Frozen Pizza", "FrostBite", "frozen", 299, 399, "300 g", "🍕", g("red-100", "rose-50"), "Margherita pizza with mozzarella — bake in 12 mins.", { isNew: true, tags: ["ready-to-cook"] }),

  // ===== INSTANT =====
  p("in1", "Instant Noodles", "QuickBowl", "instant", 14, 20, "70 g", "🍜", g("red-100", "orange-50"), "Masala instant noodles — ready in 2 minutes.", { isBestSeller: true, isFlashSale: true, tags: ["2-min"] }),
  p("in2", "Cup Soup", "QuickBowl", "instant", 45, 60, "55 g", "🍲", g("orange-100", "amber-50"), "Hot & sour cup soup — just add hot water.", { tags: ["quick"] }),
  p("in3", "Ready Dal", "QuickBowl", "instant", 89, 119, "300 g", "🥘", g("yellow-100", "amber-50"), "Ready-to-eat yellow dal — heat and serve.", { isFeatured: true, tags: ["ready-to-eat"] }),
  p("in4", "Oats", "Nature's Best", "instant", 159, 199, "1 kg", "🥣", g("amber-100", "yellow-50"), "Quick-cooking rolled oats for a healthy breakfast.", { isBestSeller: true, tags: ["healthy", "breakfast"] }),
  p("in5", "Pasta & Sauce", "QuickBowl", "instant", 129, 169, "400 g", "🍝", g("red-100", "rose-50"), "Penne pasta with creamy tomato sauce — cook in 10 mins.", { tags: ["italian"] }),
  p("in6", "Instant Coffee", "Sip Well", "instant", 285, 349, "100 g", "☕", g("stone-100", "amber-50"), "Fine instant coffee for a rich, aromatic cup.", { tags: ["coffee"] }),

  // ===== MEDICINES =====
  p("m1", "Paracetamol", "MediPlus", "medicines", 35, 45, "15 tablets", "💊", g("emerald-100", "teal-50"), "500mg paracetamol for fever and pain relief.", { isBestSeller: true, tags: ["otc"] }),
  p("m2", "Vitamin C Tablets", "MediPlus", "medicines", 199, 259, "60 tablets", "💊", g("orange-100", "amber-50"), "Immune-boosting vitamin C with zinc.", { isFeatured: true, tags: ["immunity"] }),
  p("m3", "Hand Sanitizer", "MediPlus", "medicines", 99, 129, "200 ml", "🧴", g("teal-100", "cyan-50"), "70% alcohol sanitizer with moisturizer.", { tags: ["hygiene"] }),
  p("m4", "Cough Syrup", "MediPlus", "medicines", 110, 139, "100 ml", "🧪", g("amber-100", "yellow-50"), "Soothing cough relief syrup, herbal formula.", { tags: ["otc"] }),
  p("m5", "Band-Aids", "MediPlus", "medicines", 79, 99, "30 pcs", "🩹", g("rose-100", "pink-50"), "Sterile waterproof bandages for minor cuts.", { tags: ["first-aid"] }),
  p("m6", "Multivitamin", "MediPlus", "medicines", 399, 499, "60 tablets", "💊", g("lime-100", "green-50"), "Daily multivitamin for energy and immunity.", { isNew: true, tags: ["wellness"] }),

  // ===== PET CARE =====
  p("pet1", "Dry Dog Food", "PawNest", "pet-care", 599, 799, "1.2 kg", "🐕", g("stone-100", "amber-50"), "Premium chicken & rice dog food, all life stages.", { isBestSeller: true, isFeatured: true, tags: ["dog"] }),
  p("pet2", "Cat Food", "PawNest", "pet-care", 449, 599, "1 kg", "🐈", g("orange-100", "amber-50"), "Ocean fish cat food, rich in protein.", { tags: ["cat"] }),
  p("pet3", "Pet Shampoo", "PawNest", "pet-care", 249, 319, "250 ml", "🧴", g("violet-100", "purple-50"), "Gentle deodorising pet shampoo for a shiny coat.", { tags: ["grooming"] }),
  p("pet4", "Dog Treats", "PawNest", "pet-care", 199, 259, "200 g", "🦴", g("amber-100", "yellow-50"), "Crunchy training treats dogs love.", { tags: ["treats"] }),
  p("pet5", "Cat Litter", "PawNest", "pet-care", 349, 449, "5 kg", "🪨", g("slate-100", "zinc-50"), "Clumping, odour-control cat litter.", { tags: ["cat"] }),

  // ===== ELECTRONICS =====
  p("e1", "USB-C Cable", "VoltEdge", "electronics", 199, 299, "1 m", "🔌", g("slate-100", "zinc-50"), "Fast-charging braided USB-C cable, 65W.", { isBestSeller: true, isFlashSale: true, tags: ["charging"] }),
  p("e2", "Power Bank", "VoltEdge", "electronics", 899, 1299, "10000 mAh", "🔋", g("zinc-100", "stone-50"), "Slim 10000mAh power bank with dual fast charging.", { isFeatured: true, tags: ["charging"] }),
  p("e3", "Earbuds", "VoltEdge", "electronics", 1299, 1799, "1 pair", "🎧", g("stone-100", "zinc-50"), "True wireless earbuds with ANC and 30h battery.", { isNew: true, isBestSeller: true, tags: ["audio"] }),
  p("e4", "Phone Charger", "VoltEdge", "electronics", 449, 599, "20W", "🔌", g("blue-100", "indigo-50"), "20W USB-C fast wall charger.", { tags: ["charging"] }),
  p("e5", "LED Bulb", "HomeNest", "electronics", 149, 199, "9W", "💡", g("yellow-100", "amber-50"), "Energy-saving 9W LED bulb, cool daylight.", { tags: ["lighting"] }),
  p("e6", "AA Batteries", "VoltEdge", "electronics", 199, 259, "8 pcs", "🔋", g("emerald-100", "green-50"), "Long-lasting alkaline AA batteries.", { tags: ["batteries"] }),

  // ===== HOME ESSENTIALS =====
  p("h1", "Tissue Paper Roll", "HomeNest", "home", 199, 259, "6 rolls", "🧻", g("sky-100", "blue-50"), "Soft 2-ply tissue rolls, 200 sheets each.", { isBestSeller: true, tags: ["essential"] }),
  p("h2", "Aluminium Foil", "HomeNest", "home", 89, 119, "18 ft", "📜", g("stone-100", "zinc-50"), "Heavy-duty aluminium foil for cooking & storage.", { tags: ["kitchen"] }),
  p("h3", "Cooking Oil", "Nature's Best", "home", 349, 449, "1 L", "🫗", g("yellow-100", "amber-50"), "Refined sunflower cooking oil, light & healthy.", { isFeatured: true, tags: ["essential"] }),
  p("h4", "Basmati Rice", "Nature's Best", "home", 599, 749, "5 kg", "🍚", g("amber-100", "yellow-50"), "Premium long-grain aged basmati rice.", { isBestSeller: true, tags: ["essential"] }),
  p("h5", "Wheat Flour", "Nature's Best", "home", 279, 349, "5 kg", "🌾", g("orange-100", "amber-50"), "Stone-ground whole wheat flour (atta).", { isBestSeller: true, tags: ["essential"] }),
  p("h6", "Sugar", "Nature's Best", "home", 199, 249, "2 kg", "🧂", g("rose-100", "pink-50"), "Refined white sugar, free-flowing crystals.", { tags: ["essential"] }),
  p("h7", "Tea Leaves", "Sip Well", "home", 249, 319, "500 g", "🍵", g("green-100", "emerald-50"), "Premium Assam CTC tea leaves for strong chai.", { isFeatured: true, tags: ["tea"] }),
  p("h8", "Cookware Set", "HomeNest", "home", 1299, 1799, "5 pcs", "🍳", g("stone-100", "zinc-50"), "Non-stick cookware set with glass lids.", { isNew: true, tags: ["kitchen"] }),
];

export const productMap: Record<string, Product> = Object.fromEntries(
  products.map((pr) => [pr.id, pr])
);

export function discountPct(p: Product) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function getProductById(id: string) {
  return productMap[id];
}

export function getRelatedProducts(p: Product, limit = 6) {
  return products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, limit);
}

export function getFrequentlyBought(p: Product, limit = 3) {
  // pick from different categories, prefer best sellers
  const pool = products.filter((x) => x.id !== p.id && x.category !== p.category && x.isBestSeller);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
