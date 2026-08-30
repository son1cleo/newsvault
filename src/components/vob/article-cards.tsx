import { Link } from "@/i18n/navigation";
import type { LocalizedArticle } from "@/lib/articles";
import { formatDateline, localizedNumber } from "@/lib/date-format";
import { CategoryBadge } from "@/components/vob/category-tag";

type CardProps = { article: LocalizedArticle; locale: string };

export function LeadStoryCard({ article, locale }: CardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group relative block overflow-hidden bg-vob-surface">
      {article.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImageUrl}
          alt=""
          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="aspect-[16/10] w-full bg-vob-surface-alt" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16">
        <div className="mb-3">
          <CategoryBadge category={article.category} locale={locale} />
        </div>
        <h2 className="font-vob-display text-3xl font-bold leading-snug text-white sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-3 hidden max-w-xl font-vob-sans text-lg text-white/85 sm:block">{article.excerpt}</p>
        <p className="mt-3 font-vob-sans text-base text-white/70">{formatDateline(article.publishedDate, locale)}</p>
      </div>
    </Link>
  );
}

export function SideStoryCard({ article, locale }: CardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-4">
      <div className="h-24 w-32 flex-shrink-0 overflow-hidden bg-vob-surface-alt">
        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-w-0">
        <CategoryBadge category={article.category} locale={locale} />
        <h3 className="mt-2 line-clamp-2 font-vob-display text-xl font-bold leading-snug text-vob-ink group-hover:text-vob-accent">
          {article.title}
        </h3>
        <p className="mt-2 font-vob-sans text-base text-vob-muted">{formatDateline(article.publishedDate, locale)}</p>
      </div>
    </Link>
  );
}

export function RailCard({ article, locale }: CardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-4">
      <div className="h-20 w-28 flex-shrink-0 overflow-hidden bg-vob-surface-alt sm:h-24 sm:w-32">
        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-w-0">
        <CategoryBadge category={article.category} locale={locale} />
        <h3 className="mt-2 line-clamp-2 font-vob-display text-lg font-bold leading-snug text-vob-ink group-hover:text-vob-accent sm:text-xl">
          {article.title}
        </h3>
        <p className="mt-2 font-vob-sans text-base text-vob-muted">{formatDateline(article.publishedDate, locale)}</p>
      </div>
    </Link>
  );
}

export function CompactListItem({ article, locale, index }: CardProps & { index: number }) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex items-start gap-3 py-3.5">
      <span className="font-vob-display text-3xl font-bold leading-none text-vob-accent">
        {localizedNumber(index, locale)}
      </span>
      <h4 className="line-clamp-2 font-vob-sans text-lg font-semibold leading-snug text-vob-ink group-hover:text-vob-accent">
        {article.title}
      </h4>
    </Link>
  );
}
