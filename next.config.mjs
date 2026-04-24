/** @type {import('next').NextConfig} */

// Build mode:
//   STATIC_EXPORT=true  → GitHub Pages-compatible static build (no API routes,
//                         no admin panel, no Google Calendar integration).
//   anything else       → Full Next.js build (Vercel) — all features work.
//
// Default to the full build so new server features ship by default. The
// GitHub Pages workflow sets STATIC_EXPORT=true explicitly if you still
// want to ship the static marketing site from there.
const STATIC_EXPORT = process.env.STATIC_EXPORT === "true"

const nextConfig = STATIC_EXPORT
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      basePath: process.env.BASE_PATH || "",
      assetPrefix: process.env.BASE_PATH || "",
    }
  : {
      images: { unoptimized: true },
    }

export default nextConfig
