import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/api/" },
    sitemap: "https://cinema-estate.vercel.app/sitemap.xml",
  };
}
