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
      // uploads two documents, capped at 4 MB combined so requests stay under
      // Vercel's 4.5 MB body limit (see MAX_MEMBERSHIP_UPLOAD_BYTES).
      bodySizeLimit: "5mb",
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/news/butterfly-watching-program-godavari-46-species",
        destination: "/news/godawari-butterfly-watch",
        permanent: true,
      },
      // Retired news posts (see hiddenNewsSlugs in lib/content/news.ts).
      {
        source: "/news/butterfly-images-kathmandu-valley-released",
        destination: "/publications/butterfly-images-kathmandu-valley",
        permanent: true,
      },
      {
        source: "/news/greenalaya-nepal-launch",
        destination: "/about",
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
