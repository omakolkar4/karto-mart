import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel handles bundling - no standalone output needed */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
