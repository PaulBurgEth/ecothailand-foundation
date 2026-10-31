import type { NextConfig } from "next";

// Static export for Cloudflare Pages. Security headers live in public/_headers
// (headers() is not supported with output: 'export').
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;
