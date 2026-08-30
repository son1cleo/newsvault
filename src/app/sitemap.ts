import type { MetadataRoute } from "next";
import { getAllPublishedForSitemap } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articles = await getAllPublishedForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/vault`, changeFrequency: "daily", priority: 0.9 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/article/${article.slug}`,
    lastModified: article.publishedDate,
    changeFrequency: "never",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
