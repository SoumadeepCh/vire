import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },
  // next.config.ts

  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
