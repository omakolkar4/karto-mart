import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/karto/providers";
import { ScrollProgress } from "@/components/karto/scroll-progress";
import { ScrollToTop } from "@/components/karto/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://karto.shop";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Karto — Your Everyday Shopping Partner | Grocery & Essentials in Minutes",
    template: "%s | Karto",
  },
  description:
    "Karto is a modern quick-commerce platform delivering fresh groceries, dairy, snacks, beverages, personal care & daily essentials to your doorstep in minutes. Shop 1000+ products at the best prices.",
  keywords: [
    "Karto", "grocery delivery", "quick commerce", "instant grocery", "online supermarket",
    "fruits vegetables", "dairy delivery", "snacks beverages", "daily essentials", "10 minute delivery",
  ],
  authors: [{ name: "Karto Team" }],
  creator: "Karto",
  applicationName: "Karto",
  category: "shopping",
  icons: {
    icon: "/favicon.ico",
    apple: "/karto/app-mockup.png",
  },
  openGraph: {
    title: "Karto — Your Everyday Shopping Partner",
    description: "Fresh groceries & daily essentials delivered in minutes. Best prices, fast delivery, premium quality.",
    url: SITE_URL,
    siteName: "Karto",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/karto/hero.png", width: 1440, height: 720, alt: "Karto grocery delivery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karto — Your Everyday Shopping Partner",
    description: "Fresh groceries & daily essentials delivered in minutes.",
    images: ["/karto/hero.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00C853" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1a12" },
  ],
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Karto",
  description: "Quick-commerce grocery and daily essentials delivery platform.",
  url: SITE_URL,
  slogan: "Your Everyday Shopping Partner",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        <Providers>
          <ScrollProgress />
          {children}
          <ScrollToTop />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
