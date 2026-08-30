import { and, count, desc, eq, gte, ilike, inArray, lt, or } from "drizzle-orm";
import { db } from "@/db";
import { articles, articleTranslations, type Article, type NewArticle } from "@/db/schema";

const ADMIN_PAGE_SIZE = 6;

export type LocaleContent = {
  title: string;
  excerpt: string;
  body: unknown;
};

export type ArticleTranslations = {
  en: LocaleContent;
  bn: LocaleContent;
};

export type SharedArticleFields = Omit<NewArticle, "id" | "createdAt">;

// Admin list/search/display works against the English translation — the
// admin UI itself stays English-only per the rebrand scope; editing both
// locales' content happens in the article editor.
const adminListColumns = {
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
};

// Admin views include drafts and sort by createdAt (recently worked on),
// unlike the public site which only shows published articles by publishedDate.
export async function listAllArticlesForAdmin() {
  return db
    .select(adminListColumns)
    .from(articles)
    .innerJoin(
      articleTranslations,
      and(eq(articleTranslations.articleId, articles.id), eq(articleTranslations.locale, "en"))
    )
    .orderBy(desc(articles.createdAt));
}

export type AdminArticleListItem = Awaited<ReturnType<typeof listAllArticlesForAdmin>>[number];

export type AdminArticleFilters = {
  q?: string;
  status?: "draft" | "published";
  category?: string;
  author?: string;
  date?: string; // YYYY-MM-DD, matches published_date's day
  page?: number;
};

export async function getAdminArticlesPage(filters: AdminArticleFilters) {
  const conditions = [eq(articleTranslations.locale, "en")];

  if (filters.q) {
    const pattern = `%${filters.q}%`;
    conditions.push(
      or(ilike(articleTranslations.title, pattern), ilike(articleTranslations.excerpt, pattern))!
    );
  }
  if (filters.status) conditions.push(eq(articles.status, filters.status));
  if (filters.category) conditions.push(eq(articles.category, filters.category));
  if (filters.author) conditions.push(eq(articles.author, filters.author));
  if (filters.date) {
    const start = new Date(`${filters.date}T00:00:00.000Z`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    conditions.push(and(gte(articles.publishedDate, start), lt(articles.publishedDate, end))!);
  }

  const where = and(...conditions);
  const page = Math.max(1, filters.page ?? 1);

  const baseQuery = db
    .select(adminListColumns)
    .from(articles)
    .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id));

  const [rows, [{ total }]] = await Promise.all([
    baseQuery
      .where(where)
      .orderBy(desc(articles.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset((page - 1) * ADMIN_PAGE_SIZE),
    db
      .select({ total: count() })
      .from(articles)
      .innerJoin(articleTranslations, eq(articleTranslations.articleId, articles.id))
      .where(where),
  ]);

  return {
    articles: rows,
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getAdminCategories() {
  const rows = await db.selectDistinct({ category: articles.category }).from(articles);
  return rows.map((r) => r.category).sort();
}

export async function getAdminAuthors() {
  const rows = await db.selectDistinct({ author: articles.author }).from(articles);
  return rows.map((r) => r.author).sort();
}

export async function bulkDeleteArticles(ids: number[]) {
  if (ids.length === 0) return [];
  return db.delete(articles).where(inArray(articles.id, ids)).returning({ id: articles.id });
}

export async function getArticleByIdForAdmin(
  id: number
): Promise<(Article & { translations: ArticleTranslations }) | null> {
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!article) return null;

  const rows = await db
    .select()
    .from(articleTranslations)
    .where(eq(articleTranslations.articleId, id));

  const en = rows.find((r) => r.locale === "en");
  const bn = rows.find((r) => r.locale === "bn");

  return {
    ...article,
    translations: {
      en: en
        ? { title: en.title, excerpt: en.excerpt, body: en.body }
        : { title: "", excerpt: "", body: { type: "doc", content: [] } },
      bn: bn
        ? { title: bn.title, excerpt: bn.excerpt, body: bn.body }
        : { title: "", excerpt: "", body: { type: "doc", content: [] } },
    },
  };
}

export async function createArticle(shared: SharedArticleFields, translations: ArticleTranslations) {
  const [article] = await db.insert(articles).values(shared).returning();

  await db.insert(articleTranslations).values([
    { articleId: article.id, locale: "en", ...translations.en },
    { articleId: article.id, locale: "bn", ...translations.bn },
  ]);

  return article;
}

export async function updateArticle(
  id: number,
  shared: Partial<SharedArticleFields>,
  translations: ArticleTranslations
) {
  const [article] = await db.update(articles).set(shared).where(eq(articles.id, id)).returning();
  if (!article) return null;

  for (const locale of ["en", "bn"] as const) {
    await db
      .insert(articleTranslations)
      .values({ articleId: id, locale, ...translations[locale] })
      .onConflictDoUpdate({
        target: [articleTranslations.articleId, articleTranslations.locale],
        set: translations[locale],
      });
  }

  return article;
}

export async function deleteArticle(id: number) {
  const [article] = await db.delete(articles).where(eq(articles.id, id)).returning();
  return article ?? null;
}

export async function slugExists(slug: string, excludeId?: number) {
  const rows = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug));
  return rows.some((r) => r.id !== excludeId);
}
