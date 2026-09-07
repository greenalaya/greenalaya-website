import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit; the membership form
      // uploads an identification document and a payment receipt (10MB each).
      bodySizeLimit: "25mb",
    },
  },
  images: {
    qualities: [75, 92],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      {
        source: "/news/butterfly-watching-program-godavari-46-species",
        destination: "/news/godawari-butterfly-watch",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/research",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/research/:slug",
        destination: "/publications/:slug",
        permanent: true,
      },
      {
        source: "/advisors",
        destination: "/about#advisors",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
