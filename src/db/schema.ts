import { index, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const articleStatus = pgEnum("article_status", ["draft", "published"]);

export const articles = pgTable(
  "articles",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    // TipTap JSON document. Rendered to HTML on read via @tiptap/html.
    body: jsonb("body").notNull(),
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

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
