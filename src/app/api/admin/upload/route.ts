import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPEG, WEBP, or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 5MB." }, { status: 400 });
  }

  const filename = `${randomUUID()}.${extension}`;
  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url }, { status: 201 });
}
