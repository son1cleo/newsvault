import { NextResponse, type NextRequest } from "next/server";
import { articleInputSchema } from "@/lib/article-schema";
import { createArticle, slugExists } from "@/lib/admin-articles";

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (await slugExists(data.slug)) {
    return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
  }

  const article = await createArticle({
    ...data,
    coverImageUrl: data.coverImageUrl || null,
    publishedDate: new Date(data.publishedDate),
  });

  return NextResponse.json({ article }, { status: 201 });
}
