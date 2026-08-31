import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { Link } from "@/i18n/navigation";
import { getAdjacentArticles, getArticleBySlug } from "@/lib/articles";
import { renderArticleBody } from "@/lib/render-body";
import { formatDateline, monthNameLocalized, localizedNumber } from "@/lib/date-format";
import { categoryLabel } from "@/lib/category-labels";
import { CategoryTag } from "@/components/vob/category-tag";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
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
    other: { "article:published_time": publishedIso },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();

  const { older, newer } = await getAdjacentArticles(article, locale);
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
    articleSection: categoryLabel(article.category, locale),
    mainEntityOfPage: `${siteUrl}/${locale}/article/${article.slug}`,
    publisher: { "@type": "Organization", name: "Voice of Time" },
  };

  const year = article.publishedDate.getUTCFullYear();
  const month = String(article.publishedDate.getUTCMonth() + 1).padStart(2, "0");

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="font-vob-sans text-base text-vob-muted">
        <Link href="/vault" className="hover:text-vob-accent">
          {t("vault")}
        </Link>{" "}
        /{" "}
        <Link href={`/vault/${year}`} className="hover:text-vob-accent">
          {localizedNumber(year, locale)}
        </Link>{" "}
        /{" "}
        <Link href={`/vault/${year}/${month}`} className="hover:text-vob-accent">
          {monthNameLocalized(Number(month), locale)}
        </Link>
      </p>

      <div className="mt-3">
        <CategoryTag category={article.category} locale={locale} />
      </div>

      <h1 className="mt-3 font-vob-display text-4xl font-bold leading-tight text-vob-ink sm:text-5xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-vob-border pb-4 font-vob-sans text-base text-vob-muted">
        <span>
          {t("by")} {article.author}
        </span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime={publishedIso}>{formatDateline(article.publishedDate, locale)}</time>
      </div>

      {article.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.coverImageUrl} alt="" className="mt-6 w-full rounded-md" />
      )}

      <div className="prose-vob mt-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <nav className="mt-14 grid grid-cols-1 gap-4 border-t border-vob-border pt-6 sm:grid-cols-2">
        {older ? (
          <Link href={`/article/${older.slug}`} className="group block border border-vob-border p-4 hover:bg-vob-surface-alt">
            <span className="font-vob-sans text-sm text-vob-muted">&larr;</span>
            <p className="mt-1.5 font-vob-display text-lg font-semibold text-vob-ink group-hover:text-vob-accent">
              {older.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {newer ? (
          <Link
            href={`/article/${newer.slug}`}
            className="group block border border-vob-border p-4 text-right hover:bg-vob-surface-alt"
          >
            <span className="font-vob-sans text-sm text-vob-muted">&rarr;</span>
            <p className="mt-1.5 font-vob-display text-lg font-semibold text-vob-ink group-hover:text-vob-accent">
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
