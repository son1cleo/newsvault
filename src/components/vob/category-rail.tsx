import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRecentArticles } from "@/lib/articles";
import { categoryLabel } from "@/lib/category-labels";
import { categoryColor } from "@/lib/category-colors";
import { RailCard } from "@/components/vob/article-cards";

export async function CategoryRail({ locale, category }: { locale: string; category: string }) {
  const t = await getTranslations({ locale, namespace: "sections" });
  const articles = await getRecentArticles(locale, 4, { category });
  if (articles.length === 0) return null;

  const color = categoryColor(category);

  return (
    <section className="border-t border-vob-border pt-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="block h-10 w-2 rounded-sm" style={{ backgroundColor: color.bg }} />
          <h2 className="font-vob-display text-3xl font-extrabold text-vob-ink sm:text-4xl">
            {categoryLabel(category, locale)}
          </h2>
        </div>
        <Link
          href={`/vault/${category}`}
          className="flex-shrink-0 font-vob-sans text-lg font-semibold text-vob-accent hover:text-vob-accent-hover"
        >
          {t("seeAll")} &rarr;
        </Link>
      </div>
      <div className="@container mt-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 @lg:grid-cols-2 @5xl:grid-cols-3">
          {articles.map((article) => (
            <RailCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
