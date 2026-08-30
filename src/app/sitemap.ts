import type { MetadataRoute } from "next";
import { getAllPublishedForSitemap } from "@/lib/articles";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articles = await getAllPublishedForSitemap();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push(
      { url: `${siteUrl}/${locale}`, changeFrequency: "hourly", priority: 1 },
      { url: `${siteUrl}/${locale}/vault`, changeFrequency: "hourly", priority: 0.9 }
    );

    for (const article of articles) {
      entries.push({
        url: `${siteUrl}/${locale}/article/${article.slug}`,
        lastModified: article.publishedDate,
        changeFrequency: "never",
        priority: 0.7,
      });
    }
  }

  return entries;
}
