import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["theholyspiritus.com"],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
    WOOCOMMERCE_KEY: process.env.WOOCOMMERCE_KEY,
    WOOCOMMERCE_SECRET: process.env.WOOCOMMERCE_SECRET,
  },
};

export default nextConfig;
