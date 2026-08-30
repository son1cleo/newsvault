import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import { tiptapExtensions } from "./tiptap-extensions";

export function renderArticleBody(body: JSONContent): string {
  return generateHTML(body, tiptapExtensions);
}
