import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/vob/hero-section";
import { LatestPopularTabs } from "@/components/vob/latest-popular-tabs";
import { CategoryRail } from "@/components/vob/category-rail";
import { Sidebar } from "@/components/vob/sidebar";
import { GalleryStrip } from "@/components/vob/gallery-strip";
import { getRecentArticles } from "@/lib/articles";

const RAIL_CATEGORIES = ["national", "sports", "entertainment", "technology", "lifestyle"];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tabs" });

  const hero = await getRecentArticles(locale, 4);
  const heroIds = hero.map((a) => a.id);

  const latest = await getRecentArticles(locale, 8, { excludeIds: heroIds });
  const popular = await getRecentArticles(locale, 8, { excludeIds: [...heroIds, ...latest.map((a) => a.id)] });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <HeroSection locale={locale} />

      <div className="mt-10">
        <LatestPopularTabs
          locale={locale}
          latest={latest}
          popular={popular}
          labels={{ latest: t("latest"), popular: t("popular") }}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-10">
          {RAIL_CATEGORIES.map((category) => (
            <CategoryRail key={category} locale={locale} category={category} />
          ))}
        </div>
        <Sidebar locale={locale} excludeIds={[...heroIds, ...latest.map((a) => a.id), ...popular.map((a) => a.id)]} />
      </div>

      <div className="mt-10">
        <GalleryStrip locale={locale} />
      </div>
    </div>
  );
}
