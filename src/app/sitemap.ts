import type { MetadataRoute } from "next";
import { getAllPublishedForSitemap } from "@/lib/articles";
import { routing } from "@/i18n/routing";

// Queries the DB, so this must render per-request, not at build time —
// Vercel's build machine has no reliable path to Neon, and a build-time
// sitemap would go stale the moment a new article is published anyway.
export const dynamic = "force-dynamic";

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
