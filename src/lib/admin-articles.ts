import { and, count, desc, eq, gte, ilike, inArray, lt, or } from "drizzle-orm";
import { db } from "@/db";
import { articles, type NewArticle } from "@/db/schema";

const ADMIN_PAGE_SIZE = 6;

// Admin views include drafts and sort by createdAt (recently worked on),
// unlike the public site which only shows published articles by publishedDate.
export async function listAllArticlesForAdmin() {
  return db.select().from(articles).orderBy(desc(articles.createdAt));
}

export type AdminArticleFilters = {
  q?: string;
  status?: "draft" | "published";
  category?: string;
  author?: string;
  date?: string; // YYYY-MM-DD, matches published_date's day
  page?: number;
};

export async function getAdminArticlesPage(filters: AdminArticleFilters) {
  const conditions = [];

  if (filters.q) {
    const pattern = `%${filters.q}%`;
    conditions.push(or(ilike(articles.title, pattern), ilike(articles.excerpt, pattern)));
  }
  if (filters.status) conditions.push(eq(articles.status, filters.status));
  if (filters.category) conditions.push(eq(articles.category, filters.category));
  if (filters.author) conditions.push(eq(articles.author, filters.author));
  if (filters.date) {
    const start = new Date(`${filters.date}T00:00:00.000Z`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    conditions.push(and(gte(articles.publishedDate, start), lt(articles.publishedDate, end)));
  }

  const where = conditions.length ? and(...conditions) : undefined;
  const page = Math.max(1, filters.page ?? 1);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(where)
      .orderBy(desc(articles.createdAt))
      .limit(ADMIN_PAGE_SIZE)
      .offset((page - 1) * ADMIN_PAGE_SIZE),
    db.select({ total: count() }).from(articles).where(where),
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

export async function getArticleByIdForAdmin(id: number) {
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return article ?? null;
}

export async function createArticle(data: NewArticle) {
  const [article] = await db.insert(articles).values(data).returning();
  return article;
}

export async function updateArticle(id: number, data: Partial<NewArticle>) {
  const [article] = await db
    .update(articles)
    .set(data)
    .where(eq(articles.id, id))
    .returning();
  return article ?? null;
}

export async function deleteArticle(id: number) {
  const [article] = await db.delete(articles).where(eq(articles.id, id)).returning();
  return article ?? null;
}

export async function slugExists(slug: string, excludeId?: number) {
  const rows = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug));
  return rows.some((r) => r.id !== excludeId);
}
