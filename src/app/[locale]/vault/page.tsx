import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RailCard } from "@/components/vob/article-cards";
import { getArticlesPage, getAvailableYears, getCategories } from "@/lib/articles";
import { VaultSearchForm } from "@/components/vob/vault-search-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return { title: t("vault") };
}

export default async function VaultIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cursor?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { cursor, q } = await searchParams;
  const t = await getTranslations({ locale, namespace: "common" });

  const [{ articles, nextCursor }, years, categories] = await Promise.all([
    getArticlesPage({ cursor, locale, filters: { q } }),
    getAvailableYears(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6">
      <VaultSearchForm locale={locale} years={years} categories={categories} />

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {articles.length === 0 ? (
          <p className="text-vob-muted">{t("noArticles")}</p>
        ) : (
          articles.map((article) => <RailCard key={article.id} article={article} locale={locale} />)
        )}
      </div>

      {nextCursor && (
        <div className="mt-10 text-center">
          <Link
            href={`/vault?cursor=${encodeURIComponent(nextCursor)}`}
            className="inline-block border-2 border-vob-ink px-6 py-3 font-vob-sans text-sm font-bold text-vob-ink transition-colors hover:bg-vob-surface-alt"
          >
            {t("olderDispatches")} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
