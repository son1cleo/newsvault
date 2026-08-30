import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentArticles, getArticleBySlug } from "@/lib/articles";
import { renderArticleBody } from "@/lib/render-body";
import { formatDisplayDate, monthSlug } from "@/lib/format";
import type { JSONContent } from "@tiptap/core";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const publishedIso = article.publishedDate.toISOString();

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: publishedIso,
      authors: [article.author],
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    },
    other: {
      "article:published_time": publishedIso,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { older, newer } = await getAdjacentArticles(article);
  const bodyHtml = renderArticleBody(article.body as JSONContent);
  const publishedIso = article.publishedDate.toISOString();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: publishedIso,
    author: { "@type": "Person", name: article.author },
    image: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    articleSection: article.category,
    mainEntityOfPage: `${siteUrl}/article/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "News Vault",
    },
  };

  const year = article.publishedDate.getUTCFullYear();
  const month = monthSlug(article.publishedDate.getUTCMonth() + 1);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        <Link href="/vault" className="hover:text-accent transition-colors">
          The Vault
        </Link>{" "}
        /{" "}
        <Link href={`/vault/${year}`} className="hover:text-accent transition-colors">
          {year}
        </Link>{" "}
        /{" "}
        <Link href={`/vault/${year}/${month}`} className="hover:text-accent transition-colors">
          {month}
        </Link>{" "}
        /{" "}
        <Link
          href={`/vault/${encodeURIComponent(article.category)}`}
          className="text-accent hover:text-accent-hover transition-colors"
        >
          {article.category}
        </Link>
      </p>

      <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b-2 border-ink pb-4 font-mono text-xs uppercase tracking-widest text-ink-muted">
        <span>By {article.author}</span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime={publishedIso}>{formatDisplayDate(article.publishedDate)}</time>
      </div>

      {article.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImageUrl}
          alt=""
          className="mt-8 w-full border border-rule"
        />
      )}

      <div className="prose-vault mt-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <nav className="mt-16 grid grid-cols-1 gap-4 border-t-2 border-ink pt-6 sm:grid-cols-2">
        {older ? (
          <Link
            href={`/article/${older.slug}`}
            className="group block border border-rule p-4 transition-colors hover:bg-paper-deep"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              &larr; Older
            </span>
            <p className="mt-1 font-display text-lg font-semibold text-ink group-hover:text-accent transition-colors">
              {older.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {newer ? (
          <Link
            href={`/article/${newer.slug}`}
            className="group block border border-rule p-4 text-right transition-colors hover:bg-paper-deep"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Newer &rarr;
            </span>
            <p className="mt-1 font-display text-lg font-semibold text-ink group-hover:text-accent transition-colors">
              {newer.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
