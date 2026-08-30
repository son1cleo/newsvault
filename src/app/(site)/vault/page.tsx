import type { Metadata } from "next";
import Link from "next/link";
import { ArticleRow } from "@/components/article-row";
import { VaultSearchForm } from "@/components/vault-search-form";
import { getArticlesPage, getAvailableYears, getCategories } from "@/lib/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Vault",
  description: "Every dispatch in News Vault, archived by the date it was published.",
};

export default async function VaultIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>;
}) {
  const { cursor } = await searchParams;
  const [{ articles, nextCursor }, years, categories] = await Promise.all([
    getArticlesPage({ cursor }),
    getAvailableYears(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-ink">The Vault</h1>
      <p className="mt-2 text-ink-muted">
        Every dispatch, archived by the date it was published — most recent first.
      </p>

      <VaultSearchForm years={years} categories={categories} />

      <div className="mt-8">
        {articles.length === 0 ? (
          <p className="border-t border-rule py-8 text-ink-muted">
            Nothing in the archive yet.
          </p>
        ) : (
          articles.map((article) => <ArticleRow key={article.id} article={article} />)
        )}
      </div>

      {nextCursor && (
        <div className="mt-10 text-center">
          <Link
            href={`/vault?cursor=${encodeURIComponent(nextCursor)}`}
            className="inline-block border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-paper-deep"
          >
            Older Dispatches &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
