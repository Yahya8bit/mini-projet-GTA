import type { NextConfig } from "next";

const INTERNAL_API = process.env.INTERNAL_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true, // preserve trailing slash on /api/* through to DRF
  async rewrites() {
    return [
      { source: "/media/:path*", destination: `${INTERNAL_API}/media/:path*` },
      { source: "/api/:path*", destination: `${INTERNAL_API}/api/:path*/` },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
        port: "8000",
        pathname: "/media/**",
      },
    ],
    dangerouslyAllowLocalIP: true, // dev only: backend Django sur localhost:8000
  },
};

export default nextConfig;
