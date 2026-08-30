import { z } from "zod";

export const articleInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  body: z.object({ type: z.literal("doc") }).passthrough(),
  category: z.string().trim().min(1, "Category is required"),
  coverImageUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  publishedDate: z
    .string()
    .datetime({ message: "publishedDate must be an ISO datetime" })
    .refine((value) => new Date(value).getTime() <= Date.now(), {
      message: "publishedDate must be in the past",
    }),
  status: z.enum(["draft", "published"]),
  author: z.string().trim().min(1, "Author is required"),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
