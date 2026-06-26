import type { NextConfig } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE_URL}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${API_BASE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
