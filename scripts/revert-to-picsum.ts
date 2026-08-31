import { config } from "dotenv";
config({ path: ".env.local" });
import { like } from "drizzle-orm";
import { db } from "../src/db/index";
import { articles } from "../src/db/schema";
import { sql } from "drizzle-orm";

// Reverts the demo articles' placeholder Blob images back to picsum.photos,
// to re-test whether picsum was actually the problem or just a fluke.

async function main() {
  const rows = await db
    .select({ id: articles.id, slug: articles.slug })
    .from(articles)
    .where(like(articles.coverImageUrl, "%blob.vercel-storage.com%demo-%"));

  console.log(`Found ${rows.length} demo article(s) to revert.`);

  for (const row of rows) {
    const url = `https://picsum.photos/seed/${row.slug}/1200/675`;
    await db.execute(sql`update articles set cover_image_url = ${url} where id = ${row.id}`);
    console.log(`Reverted ${row.slug} -> ${url}`);
  }

  console.log("Done.");
}

main().then(() => process.exit(0));
