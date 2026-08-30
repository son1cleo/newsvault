import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { RailCard } from "@/components/vob/article-cards";
import { VaultSearchForm } from "@/components/vob/vault-search-form";
import { getArticlesPage, getAvailableYears, getCategories } from "@/lib/articles";
import { monthNameLocalized, localizedNumber } from "@/lib/date-format";

export const dynamic = "force-dynamic";

const YEAR_RE = /^\d{4}$/;
const MONTH_RE = /^(0?[1-9]|1[0-2])$/;
const DAY_RE = /^(0?[1-9]|[12]\d|3[01])$/;

function parseParams(param: string, month: string, day?: string) {
  if (!YEAR_RE.test(param) || !MONTH_RE.test(month)) return null;
  const parsedDay = day && DAY_RE.test(day) ? Number(day) : undefined;
  return { year: Number(param), month: Number(month), day: parsedDay };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; param: string; month: string }>;
}): Promise<Metadata> {
  const { locale, param, month } = await params;
  const parsed = parseParams(param, month);
  if (!parsed) return {};
  return { title: `${monthNameLocalized(parsed.month, locale)} ${localizedNumber(parsed.year, locale)}` };
}

export default async function VaultMonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; param: string; month: string }>;
  searchParams: Promise<{ cursor?: string; day?: string }>;
}) {
  const { locale, param, month } = await params;
  const { cursor, day } = await searchParams;
  const t = await getTranslations({ locale, namespace: "common" });
  const parsed = parseParams(param, month, day);
  if (!parsed) notFound();

  const [{ articles, nextCursor }, years, categories] = await Promise.all([
    getArticlesPage({ cursor, locale, filters: { year: parsed.year, month: parsed.month, day: parsed.day } }),
    getAvailableYears(),
    getCategories(),
  ]);

  const heading = parsed.day
    ? `${localizedNumber(parsed.day, locale)} ${monthNameLocalized(parsed.month, locale)} ${localizedNumber(parsed.year, locale)}`
    : `${monthNameLocalized(parsed.month, locale)} ${localizedNumber(parsed.year, locale)}`;

  const basePath = `/vault/${param}/${month}`;
  const dayQuery = parsed.day ? `day=${parsed.day}` : "";
  const nextHref =
    nextCursor && `${basePath}?${[dayQuery, `cursor=${encodeURIComponent(nextCursor)}`].filter(Boolean).join("&")}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="font-vob-sans text-base text-vob-muted">
        <Link href="/vault" className="hover:text-vob-accent">
          {t("vault")}
        </Link>{" "}
        /{" "}
        <Link href={`/vault/${param}`} className="hover:text-vob-accent">
          {localizedNumber(parsed.year, locale)}
        </Link>
      </p>
      <h1 className="mt-2 font-vob-display text-4xl font-extrabold text-vob-ink sm:text-5xl">{heading}</h1>

      <VaultSearchForm
        locale={locale}
        years={years}
        categories={categories}
        initial={{ year: parsed.year, month: parsed.month, day: parsed.day }}
      />

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {articles.length === 0 ? (
          <p className="text-vob-muted">{t("noArticles")}</p>
        ) : (
          articles.map((article) => <RailCard key={article.id} article={article} locale={locale} />)
        )}
      </div>

      {nextHref && (
        <div className="mt-10 text-center">
          <Link
            href={nextHref}
            className="inline-block border-2 border-vob-ink px-7 py-3.5 font-vob-sans text-lg font-bold text-vob-ink transition-colors hover:bg-vob-surface-alt"
          >
            {t("olderDispatches")} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
