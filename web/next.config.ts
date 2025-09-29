import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
   compiler: {
    // This will automatically remove all console logs from production builds
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
