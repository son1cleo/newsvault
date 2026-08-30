import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleRow } from "@/components/article-row";
import { VaultSearchForm } from "@/components/vault-search-form";
import { getArticlesPage, getAvailableYears, getCategories } from "@/lib/articles";
import { monthName } from "@/lib/format";

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
  params: Promise<{ param: string; month: string }>;
}): Promise<Metadata> {
  const { param, month } = await params;
  const parsed = parseParams(param, month);
  if (!parsed) return {};
  return {
    title: `${monthName(parsed.month)} ${parsed.year}`,
    description: `Dispatches from ${monthName(parsed.month)} ${parsed.year}.`,
  };
}

export default async function VaultMonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ param: string; month: string }>;
  searchParams: Promise<{ cursor?: string; day?: string }>;
}) {
  const { param, month } = await params;
  const { cursor, day } = await searchParams;
  const parsed = parseParams(param, month, day);
  if (!parsed) notFound();

  const [{ articles, nextCursor }, years, categories] = await Promise.all([
    getArticlesPage({
      cursor,
      filters: { year: parsed.year, month: parsed.month, day: parsed.day },
    }),
    getAvailableYears(),
    getCategories(),
  ]);

  const heading = parsed.day
    ? `${monthName(parsed.month)} ${parsed.day}, ${parsed.year}`
    : `${monthName(parsed.month)} ${parsed.year}`;

  const basePath = `/vault/${param}/${month}`;
  const dayQuery = parsed.day ? `day=${parsed.day}` : "";
  const nextHref =
    nextCursor &&
    `${basePath}?${[dayQuery, `cursor=${encodeURIComponent(nextCursor)}`].filter(Boolean).join("&")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        <Link href="/vault" className="hover:text-accent transition-colors">
          The Vault
        </Link>{" "}
        /{" "}
        <Link href={`/vault/${param}`} className="hover:text-accent transition-colors">
          {parsed.year}
        </Link>{" "}
        / {parsed.day ? "Day" : "Month"}
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold text-ink">{heading}</h1>

      <VaultSearchForm
        years={years}
        categories={categories}
        initial={{ year: parsed.year, month: parsed.month, day: parsed.day }}
      />

      <div className="mt-8">
        {articles.length === 0 ? (
          <p className="border-t border-rule py-8 text-ink-muted">
            No dispatches found for {heading}.
          </p>
        ) : (
          articles.map((article) => <ArticleRow key={article.id} article={article} />)
        )}
      </div>

      {nextHref && (
        <div className="mt-10 text-center">
          <Link
            href={nextHref}
            className="inline-block border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-paper-deep"
          >
            Older Dispatches &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
