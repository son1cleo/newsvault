import { Link } from "@/i18n/navigation";
import { categoryLabel } from "@/lib/category-labels";
import { categoryColor } from "@/lib/category-colors";

const badgeClasses = "inline-block px-3 py-1.5 font-vob-sans text-sm font-bold uppercase tracking-wide";

// Clickable — only safe to use where it is NOT nested inside another <a>
// (e.g. article detail pages). For article cards that are themselves a
// whole-card link, use CategoryBadge instead to avoid invalid nested anchors.
export function CategoryTag({ category, locale }: { category: string; locale: string }) {
  const color = categoryColor(category);
  return (
    <Link
      href={`/vault/${category}`}
      className={`${badgeClasses} transition-opacity hover:opacity-85`}
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {categoryLabel(category, locale)}
    </Link>
  );
}

// Non-interactive — safe to nest inside a card that's already a link.
export function CategoryBadge({ category, locale }: { category: string; locale: string }) {
  const color = categoryColor(category);
  return (
    <span className={badgeClasses} style={{ backgroundColor: color.bg, color: color.text }}>
      {categoryLabel(category, locale)}
    </span>
  );
}
