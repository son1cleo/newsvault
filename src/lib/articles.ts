import { and, asc, desc, eq, gte, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles, articleTranslations, type Article, type ArticleTranslation } from "@/db/schema";
import { decodeCursor, encodeCursor, type ArticleCursor } from "@/lib/pagination";

const PAGE_SIZE = 12;

// Route params are always plain `string`; the enum column needs the
// narrowed literal type. Anything unrecognized falls back to English.
function toDbLocale(locale: string): "bn" | "en" {
  return locale === "bn" ? "bn" : "en";
}

export type LocalizedArticle = Article &
  Pick<ArticleTranslation, "title" | "excerpt" | "body">;

export type ArticleFilters = {
  year?: number;
  month?: number; // 1-12
  day?: number; // 1-31, only applied when year and month are also set
  category?: string;
  q?: string;
};

function dateRangeFilter({ year, month, day }: ArticleFilters) {
  if (!year) return undefined;

  if (month && day) {
    const start = new Date(Date.UTC(year, month - 1, day));
    const end = new Date(Date.UTC(year, month - 1, day + 1));
    return and(gte(articles.publishedDate, start), lt(articles.publishedDate, end));
  }

  const start = new Date(Date.UTC(year, month ? month - 1 : 0, 1));
  const end = month
    ? new Date(Date.UTC(year, month, 1))
    : new Date(Date.UTC(year + 1, 0, 1));
  return and(gte(articles.publishedDate, start), lt(articles.publishedDate, end));
}

// Flattens a joined {articles, article_translations} row into one object.
// Drizzle returns joined selects as {articles: {...}, article_translations: {...}}
// when both full tables are selected; we select explicit columns instead so
// the shape is already flat.
const articleColumns = {
  id: articles.id,
  slug: articles.slug,
  category: articles.category,
  coverImageUrl: articles.coverImageUrl,
  publishedDate: articles.publishedDate,
  createdAt: articles.createdAt,
  status: articles.status,
  author: articles.author,
  title: articleTranslations.title,
  excerpt: articleTranslations.excerpt,
  body: articleTranslations.body,
};

export async function getArticlesPage(opts: {
  cursor?: string;
  filters?: ArticleFilters;
  limit?: number;
  locale: string;
}): Promise<{ articles: LocalizedArticle[]; nextCursor: string | null }> {
  const limit = opts.limit ?? PAGE_SIZE;
  const decoded = decodeCursor(opts.cursor);

  const conditions = [eq(articles.status, "published"), eq(articleTranslations.locale, toDbLocale(opts.locale))];

  const range = dateRangeFilter(opts.filters ?? {});
  if (range) conditions.push(range);
  if (opts.filters?.category) conditions.push(eq(articles.category, opts.filters.category));
  if (opts.filters?.q) {
    const pattern = `%${opts.filters.q}%`;
    conditions.push(
      or(ilike(articleTranslations.title, pattern), ilike(articleTranslations.excerpt, pattern))!
    );
  }
  if (decoded) conditions.push(beforeCursor(decoded));

  const rows = await db
    .select(articleColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
    .where(and(...conditions))
    .orderBy(desc(articles.publishedDate), desc(articles.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];

  const nextCursor =
    hasMore && last
      ? encodeCursor({ publishedDate: last.publishedDate.toISOString(), id: last.id })
      : null;

  return { articles: page as LocalizedArticle[], nextCursor };
}

// Row-wise comparison keeps ordering and filtering on the exact same keys
// used in ORDER BY, so pagination never duplicates or skips a row even when
// multiple articles share a published_date.
function beforeCursor(cursor: ArticleCursor) {
  return sql`(${articles.publishedDate}, ${articles.id}) < (${new Date(cursor.publishedDate)}, ${cursor.id})`;
}

export async function getArticleBySlug(slug: string, locale: string): Promise<LocalizedArticle | null> {
  const [article] = await db
    .select(articleColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
    .where(
      and(eq(articles.slug, slug), eq(articles.status, "published"), eq(articleTranslations.locale, toDbLocale(locale)))
    )
    .limit(1);
  return (article as LocalizedArticle) ?? null;
}

export async function getAdjacentArticles(
  article: { publishedDate: Date; id: number },
  locale: string
) {
  const adjacentColumns = {
    slug: articles.slug,
    title: articleTranslations.title,
    publishedDate: articles.publishedDate,
  };

  const [older] = await db
    .select(adjacentColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
    .where(
      and(
        eq(articles.status, "published"),
        eq(articleTranslations.locale, toDbLocale(locale)),
        sql`(${articles.publishedDate}, ${articles.id}) < (${article.publishedDate}, ${article.id})`
      )
    )
    .orderBy(desc(articles.publishedDate), desc(articles.id))
    .limit(1);

  const [newer] = await db
    .select(adjacentColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
    .where(
      and(
        eq(articles.status, "published"),
        eq(articleTranslations.locale, toDbLocale(locale)),
        sql`(${articles.publishedDate}, ${articles.id}) > (${article.publishedDate}, ${article.id})`
      )
    )
    .orderBy(asc(articles.publishedDate), asc(articles.id))
    .limit(1);

  return { older: older ?? null, newer: newer ?? null };
}

export async function getAllPublishedForSitemap() {
  return db
    .select({ slug: articles.slug, publishedDate: articles.publishedDate })
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedDate), desc(articles.id));
}

export async function getAvailableYears() {
  const yearExpr = sql<number>`extract(year from ${articles.publishedDate})::int`;
  const rows = await db
    .selectDistinct({ year: yearExpr })
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(yearExpr));
  return rows.map((r) => r.year);
}

export async function getCategories() {
  const rows = await db
    .selectDistinct({ category: articles.category })
    .from(articles)
    .where(eq(articles.status, "published"));
  return rows.map((r) => r.category).sort();
}

// --- Homepage-specific queries (Voice of Bangla) ---

export async function getRecentArticles(
  locale: string,
  limit: number,
  opts?: { category?: string; excludeIds?: number[] }
): Promise<LocalizedArticle[]> {
  const conditions = [eq(articles.status, "published"), eq(articleTranslations.locale, toDbLocale(locale))];
  if (opts?.category) conditions.push(eq(articles.category, opts.category));
  if (opts?.excludeIds?.length) {
    conditions.push(sql`${articles.id} not in (${sql.join(opts.excludeIds, sql`, `)})`);
  }

  const rows = await db
    .select(articleColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
    .where(and(...conditions))
    .orderBy(desc(articles.publishedDate), desc(articles.id))
    .limit(limit);

  return rows as LocalizedArticle[];
}

// No read-count tracking exists yet; "most read" reuses recency as a
// reasonable stand-in signal, offset past the hero so lists don't repeat.
export async function getMostReadArticles(locale: string, limit: number, excludeIds: number[] = []) {
  return getRecentArticles(locale, limit, { excludeIds });
}

export async function getGalleryArticles(locale: string, limit: number): Promise<LocalizedArticle[]> {
  const rows = await db
    .select(articleColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
    .where(
      and(
        eq(articles.status, "published"),
        eq(articleTranslations.locale, toDbLocale(locale)),
        sql`${articles.coverImageUrl} is not null`
      )
    )
    .orderBy(desc(articles.publishedDate), desc(articles.id))
    .limit(limit);

  return rows as LocalizedArticle[];
}
