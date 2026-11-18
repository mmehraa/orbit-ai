import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → plain files in /out, free to host on Cloudflare Pages / Netlify / Vercel.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
