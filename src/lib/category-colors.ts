import type { CategorySlug } from "@/lib/category-labels";

// Per-category accent colors, layered on top of the overall cream/red
// theme — used for card badges, archive thumbnails, and the left-accent
// bar on homepage section headers. Not part of the site-wide vob-* theme
// tokens on purpose: these vary per category, the theme doesn't.
export const CATEGORY_COLORS: Record<CategorySlug, string> = {
  national: "var(--color-vob-accent)", // reuse the brand red — matches spec's জাতীয়=red
  international: "#2563eb", // blue
  politics: "#7c3aed", // violet
  economy: "#d97706", // amber
  sports: "#16a34a", // green
  entertainment: "#9333ea", // purple
  technology: "#0891b2", // teal/cyan
  lifestyle: "#db2777", // pink
};

const ON_COLOR = "#ffffff";

export function categoryColor(slug: string): { bg: string; text: string } {
  return { bg: CATEGORY_COLORS[slug as CategorySlug] ?? "var(--color-vob-accent)", text: ON_COLOR };
}
