import { config } from "dotenv";
config({ path: ".env.local" });
import { put } from "@vercel/blob";
import { eq, like } from "drizzle-orm";
import { db } from "../src/db/index";
import { articles } from "../src/db/schema";

// One-time fix: fetch a real photo from picsum.photos SERVER-SIDE (a single
// fetch here, not something every visitor's browser depends on) and
// re-host the actual bytes permanently on Blob. Removes the placeholder
// text-on-color images without adding any live runtime dependency on
// picsum's uptime.

async function main() {
  const rows = await db
    .select({ id: articles.id, slug: articles.slug })
    .from(articles)
    .where(like(articles.coverImageUrl, "%blob.vercel-storage.com%demo-%"));

  console.log(`Found ${rows.length} demo article(s) to fetch real photos for.`);

  for (const row of rows) {
    const src = `https://picsum.photos/seed/${row.slug}/1200/675`;
    const res = await fetch(src);
    if (!res.ok) {
      console.error(`FAILED to fetch ${src}: ${res.status}`);
      continue;
    }
    const bytes = Buffer.from(await res.arrayBuffer());

    const blob = await put(`uploads/demo-${row.slug}.jpg`, bytes, {
      access: "public",
      contentType: "image/jpeg",
      allowOverwrite: true,
    });

    await db.update(articles).set({ coverImageUrl: blob.url }).where(eq(articles.id, row.id));
    console.log(`Updated ${row.slug} -> ${blob.url}`);
  }

  console.log("Done.");
}

main().then(() => process.exit(0));
