import { NextResponse, type NextRequest } from "next/server";
import { articleInputSchema } from "@/lib/article-schema";
import { deleteArticle, getArticleByIdForAdmin, slugExists, updateArticle } from "@/lib/admin-articles";

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  const existing = await getArticleByIdForAdmin(id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const json = await request.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { translations, ...shared } = parsed.data;

  if (await slugExists(shared.slug, id)) {
    return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
  }

  const article = await updateArticle(
    id,
    {
      ...shared,
      coverImageUrl: shared.coverImageUrl || null,
      publishedDate: new Date(shared.publishedDate),
    },
    translations
  );

  return NextResponse.json({ article });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  const article = await deleteArticle(id);
  if (!article) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
