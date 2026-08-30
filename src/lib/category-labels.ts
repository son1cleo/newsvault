// Canonical category slugs stored in articles.category. Display labels are
// localized here rather than in the database — the value stored and used
// for routing/filtering never changes with locale.
export const CATEGORY_SLUGS = [
  "national",
  "international",
  "politics",
  "economy",
  "sports",
  "entertainment",
  "technology",
  "lifestyle",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

const LABELS: Record<CategorySlug, { bn: string; en: string }> = {
  national: { bn: "জাতীয়", en: "National" },
  international: { bn: "আন্তর্জাতিক", en: "International" },
  politics: { bn: "রাজনীতি", en: "Politics" },
  economy: { bn: "অর্থনীতি", en: "Economy" },
  sports: { bn: "খেলাধুলা", en: "Sports" },
  entertainment: { bn: "বিনোদন", en: "Entertainment" },
  technology: { bn: "প্রযুক্তি", en: "Technology" },
  lifestyle: { bn: "জীবনযাপন", en: "Lifestyle" },
};

export function categoryLabel(slug: string, locale: string): string {
  const entry = LABELS[slug as CategorySlug];
  if (!entry) return slug;
  return locale === "bn" ? entry.bn : entry.en;
}
