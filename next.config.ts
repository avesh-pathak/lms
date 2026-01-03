import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance Optimizations */

  // Target modern browsers only - removes legacy polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
    formats: ["image/webp", "image/avif"], // Modern formats first
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Common breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },

  // Enable strict mode for better performance
  reactStrictMode: true,

  // Optimize CSS
  experimental: {
    optimizeCss: true,
  },

  // Production optimizations
  swcMinify: true,

  // Output standalone for smaller builds
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default nextConfig;
