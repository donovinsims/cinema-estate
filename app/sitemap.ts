import type { MetadataRoute } from "next";

const siteUrl = "https://cinema-estate.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/listing-plan`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/villa-siena`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/terms`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
