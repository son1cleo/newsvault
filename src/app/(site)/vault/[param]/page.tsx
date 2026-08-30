import type { Metadata } from "next";
import Link from "next/link";
import { ArticleRow } from "@/components/article-row";
import { VaultSearchForm } from "@/components/vault-search-form";
import { getArticlesPage, getAvailableYears, getCategories } from "@/lib/articles";

export const dynamic = "force-dynamic";

const YEAR_RE = /^\d{4}$/;

function paramToFilters(param: string) {
  const decoded = decodeURIComponent(param);
  if (YEAR_RE.test(decoded)) {
    return { kind: "year" as const, year: Number(decoded) };
  }
  return { kind: "category" as const, category: decoded };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ param: string }>;
}): Promise<Metadata> {
  const { param } = await params;
  const filters = paramToFilters(param);
  if (filters.kind === "year") {
    return { title: `${filters.year}`, description: `Dispatches from ${filters.year}.` };
  }
  return { title: filters.category, description: `Dispatches filed under ${filters.category}.` };
}

export default async function VaultParamPage({
  params,
  searchParams,
}: {
  params: Promise<{ param: string }>;
  searchParams: Promise<{ cursor?: string }>;
}) {
  const { param } = await params;
  const { cursor } = await searchParams;
  const filters = paramToFilters(param);

  const [{ articles, nextCursor }, years, categories] = await Promise.all([
    getArticlesPage({
      cursor,
      filters:
        filters.kind === "year" ? { year: filters.year } : { category: filters.category },
    }),
    getAvailableYears(),
    getCategories(),
  ]);

  const heading = filters.kind === "year" ? String(filters.year) : filters.category;
  const nextHref =
    nextCursor && `/vault/${encodeURIComponent(param)}?cursor=${encodeURIComponent(nextCursor)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        <Link href="/vault" className="hover:text-accent transition-colors">
          The Vault
        </Link>{" "}
        / {filters.kind === "year" ? "Year" : "Category"}
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold text-ink">{heading}</h1>

      <VaultSearchForm
        years={years}
        categories={categories}
        initial={filters.kind === "year" ? { year: filters.year } : { category: filters.category }}
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
