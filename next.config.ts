import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Scoped to app/ only, so the Vercel/Next build's full-project type check
  // never touches the Cloudflare Worker code (worker/, db/) that vinext's
  // own build compiles without type-checking. Keep tsconfig.json untouched
  // for editors and the vinext/Cloudflare build.
  typescript: { tsconfigPath: "tsconfig.vercel.json" },
};

export default nextConfig;
