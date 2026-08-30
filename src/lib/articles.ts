import { and, asc, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { decodeCursor, encodeCursor, type ArticleCursor } from "@/lib/pagination";

const PAGE_SIZE = 12;

export type ArticleFilters = {
  year?: number;
  month?: number; // 1-12
  day?: number; // 1-31, only applied when year and month are also set
  category?: string;
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

export async function getArticlesPage(opts: {
  cursor?: string;
  filters?: ArticleFilters;
  limit?: number;
}) {
  const limit = opts.limit ?? PAGE_SIZE;
  const decoded = decodeCursor(opts.cursor);

  const conditions = [eq(articles.status, "published")];

  const range = dateRangeFilter(opts.filters ?? {});
  if (range) conditions.push(range);
  if (opts.filters?.category) conditions.push(eq(articles.category, opts.filters.category));
  if (decoded) conditions.push(beforeCursor(decoded));

  const rows = await db
    .select()
    .from(articles)
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

  return { articles: page, nextCursor };
}

// Row-wise comparison keeps ordering and filtering on the exact same keys
// used in ORDER BY, so pagination never duplicates or skips a row even when
// multiple articles share a published_date.
function beforeCursor(cursor: ArticleCursor) {
  return sql`(${articles.publishedDate}, ${articles.id}) < (${new Date(cursor.publishedDate)}, ${cursor.id})`;
}

export async function getArticleBySlug(slug: string) {
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return article ?? null;
}

export async function getAdjacentArticles(article: { publishedDate: Date; id: number }) {
  const [older] = await db
    .select({ slug: articles.slug, title: articles.title, publishedDate: articles.publishedDate })
    .from(articles)
    .where(
      and(
        eq(articles.status, "published"),
        sql`(${articles.publishedDate}, ${articles.id}) < (${article.publishedDate}, ${article.id})`
      )
    )
    .orderBy(desc(articles.publishedDate), desc(articles.id))
    .limit(1);

  const [newer] = await db
    .select({ slug: articles.slug, title: articles.title, publishedDate: articles.publishedDate })
    .from(articles)
    .where(
      and(
        eq(articles.status, "published"),
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
