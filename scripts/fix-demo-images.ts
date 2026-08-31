import { config } from "dotenv";
config({ path: ".env.local" });
import { put } from "@vercel/blob";
import { eq, like } from "drizzle-orm";
import { db } from "../src/db/index";
import { articles } from "../src/db/schema";
import { categoryLabel } from "../src/lib/category-labels";
import { categoryColor } from "../src/lib/category-colors";

// One-off fix: the seed script backed cover images with picsum.photos,
// which turned out to be unreliable as a "real" host. This regenerates a
// permanent placeholder for every article still pointing at picsum and
// uploads it to Vercel Blob, same as a real admin-panel image upload would.

function placeholderSvg(label: string, bg: string): string {
  const escaped = label.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="${bg}" />
  <text x="600" y="337.5" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="56" fill="#ffffff">
    ${escaped}
  </text>
</svg>`;
}

async function main() {
  const rows = await db
    .select({ id: articles.id, slug: articles.slug, category: articles.category })
    .from(articles)
    .where(like(articles.coverImageUrl, "%picsum.photos%"));

  console.log(`Found ${rows.length} article(s) with picsum.photos cover images.`);

  for (const row of rows) {
    const label = categoryLabel(row.category, "en");
    const bg = categoryColor(row.category).bg.startsWith("var(")
      ? "#c8102e"
      : categoryColor(row.category).bg;
    const svg = placeholderSvg(label, bg);

    const blob = await put(`uploads/demo-${row.slug}.svg`, svg, {
      access: "public",
      contentType: "image/svg+xml",
    });

    await db.update(articles).set({ coverImageUrl: blob.url }).where(eq(articles.id, row.id));
    console.log(`Updated ${row.slug} -> ${blob.url}`);
  }

  console.log("Done.");
}

main().then(() => process.exit(0));
