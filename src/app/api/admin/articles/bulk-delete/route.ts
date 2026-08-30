import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { bulkDeleteArticles } from "@/lib/admin-articles";

const bodySchema = z.object({ ids: z.array(z.number().int().positive()).min(1) });

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const deleted = await bulkDeleteArticles(parsed.data.ids);
  return NextResponse.json({ ok: true, deletedCount: deleted.length });
}
