import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const articleStatus = pgEnum("article_status", ["draft", "published"]);
export const localeEnum = pgEnum("locale", ["bn", "en"]);

export const articles = pgTable(
  "articles",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    slug: text("slug").notNull().unique(),
    // title/excerpt/body live in `articleTranslations`, keyed by locale.
    category: text("category").notNull(),
    coverImageUrl: text("cover_image_url"),
    // Admin-assigned DISPLAY date. All public sorting/filtering uses this.
    publishedDate: timestamp("published_date", { withTimezone: true, mode: "date" }).notNull(),
    // Real insertion time. Never used for public sorting/filtering.
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    status: articleStatus("status").notNull().default("draft"),
    author: text("author").notNull(),
  },
  (table) => [
    index("articles_published_date_id_idx").on(table.publishedDate.desc(), table.id.desc()),
    index("articles_category_idx").on(table.category),
    index("articles_status_idx").on(table.status),
  ]
);

// Per-locale content for an article (Voice of Bangla bilingual rebrand).
// title/excerpt/body live here, keyed by locale; shared fields (slug,
// category, author, cover image, published_date, status) stay on
// `articles` and are unaffected by locale.
export const articleTranslations = pgTable(
  "article_translations",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: jsonb("body").notNull(),
  },
  (table) => [
    unique("article_translations_article_locale_unique").on(table.articleId, table.locale),
    index("article_translations_article_id_idx").on(table.articleId),
  ]
);

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type ArticleTranslation = typeof articleTranslations.$inferSelect;
export type NewArticleTranslation = typeof articleTranslations.$inferInsert;
