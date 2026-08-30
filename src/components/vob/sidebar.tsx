import { getTranslations } from "next-intl/server";
import { getMostReadArticles } from "@/lib/articles";
import { CompactListItem } from "@/components/vob/article-cards";
import { NewsletterForm } from "@/components/vob/newsletter-form";
import { WeatherWidget } from "@/components/vob/weather-widget";

export async function Sidebar({ locale, excludeIds }: { locale: string; excludeIds: number[] }) {
  const t = await getTranslations({ locale, namespace: "sections" });
  const mostRead = await getMostReadArticles(locale, 5, excludeIds);

  return (
    <aside className="flex flex-col gap-8">
      {mostRead.length > 0 && (
        <div className="border border-vob-border bg-vob-surface p-5">
          <h3 className="font-vob-display text-2xl font-bold text-vob-ink">{t("mostRead")}</h3>
          <div className="mt-2 divide-y divide-vob-border">
            {mostRead.map((article, i) => (
              <CompactListItem key={article.id} article={article} locale={locale} index={i + 1} />
            ))}
          </div>
        </div>
      )}

      <NewsletterForm
        title={t("newsletter")}
        body={t("newsletterBody")}
        placeholder={t("newsletterPlaceholder")}
        cta={t("subscribe")}
      />

      <WeatherWidget title={t("weather")} />
    </aside>
  );
}
