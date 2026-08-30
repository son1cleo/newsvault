import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RailCard } from "@/components/vob/article-cards";
import { VaultSearchForm } from "@/components/vob/vault-search-form";
import { getArticlesPage, getAvailableYears, getCategories } from "@/lib/articles";
import { categoryLabel } from "@/lib/category-labels";
import { categoryColor } from "@/lib/category-colors";
import { localizedNumber } from "@/lib/date-format";

export const dynamic = "force-dynamic";

const YEAR_RE = /^\d{4}$/;

function paramToFilters(param: string) {
  const decoded = decodeURIComponent(param);
  if (YEAR_RE.test(decoded)) return { kind: "year" as const, year: Number(decoded) };
  return { kind: "category" as const, category: decoded };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; param: string }>;
}): Promise<Metadata> {
  const { locale, param } = await params;
  const filters = paramToFilters(param);
  if (filters.kind === "year") return { title: localizedNumber(filters.year, locale) };
  return { title: categoryLabel(filters.category, locale) };
}

export default async function VaultParamPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; param: string }>;
  searchParams: Promise<{ cursor?: string }>;
}) {
  const { locale, param } = await params;
  const { cursor } = await searchParams;
  const t = await getTranslations({ locale, namespace: "common" });
  const filters = paramToFilters(param);

  const [{ articles, nextCursor }, years, categories] = await Promise.all([
    getArticlesPage({
      cursor,
      locale,
      filters: filters.kind === "year" ? { year: filters.year } : { category: filters.category },
    }),
    getAvailableYears(),
    getCategories(),
  ]);

  const heading = filters.kind === "year" ? localizedNumber(filters.year, locale) : categoryLabel(filters.category, locale);
  const accentColor = filters.kind === "category" ? categoryColor(filters.category).bg : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="font-vob-sans text-base text-vob-muted">
        <Link href="/vault" className="hover:text-vob-accent">
          {t("vault")}
        </Link>{" "}
        / {heading}
      </p>
      <div className="mt-2 flex items-center gap-3">
        {accentColor && (
          <span aria-hidden="true" className="block h-8 w-1.5 rounded-sm" style={{ backgroundColor: accentColor }} />
        )}
        <h1 className="font-vob-display text-4xl font-extrabold text-vob-ink sm:text-5xl">{heading}</h1>
      </div>

      <VaultSearchForm
        locale={locale}
        years={years}
        categories={categories}
        initial={filters.kind === "year" ? { year: filters.year } : { category: filters.category }}
      />

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
            href={`/vault/${encodeURIComponent(param)}?cursor=${encodeURIComponent(nextCursor)}`}
            className="inline-block border-2 border-vob-ink px-7 py-3.5 font-vob-sans text-lg font-bold text-vob-ink transition-colors hover:bg-vob-surface-alt"
          >
            {t("olderDispatches")} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
