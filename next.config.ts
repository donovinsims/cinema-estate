import type { NextConfig } from "next";

// Scoped to the third-party origins this site actually calls: PostHog (analytics, gated
// behind user consent — see app/AnalyticsConsent.tsx), Google Fonts (villa-siena's own
// stylesheet link, app/villa-siena/page.tsx), and Vercel Analytics/Speed Insights. The
// latter load same-origin (/_vercel/insights/script.js) in production, but fall back to
// the cross-origin va.vercel-scripts.com debug script in local dev — script-src allows it
// so the dev console stays clean. Polar checkout is a plain top-level navigation, not a
// fetch/frame, so it needs no CSP allowance.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://us.i.posthog.com https://us-assets.i.posthog.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://us.i.posthog.com https://us-assets.i.posthog.com",
  "media-src 'self'",
  "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "tsconfig.vercel.json",
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
