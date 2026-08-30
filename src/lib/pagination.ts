export type ArticleCursor = { publishedDate: string; id: number };

export function encodeCursor(cursor: ArticleCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeCursor(raw: string | undefined | null): ArticleCursor | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.publishedDate === "string" &&
      typeof parsed.id === "number"
    ) {
      return parsed as ArticleCursor;
    }
    return null;
  } catch {
    return null;
  }
}
