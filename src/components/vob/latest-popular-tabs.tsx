"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { LocalizedArticle } from "@/lib/articles";
import { formatDateline } from "@/lib/date-format";
import { CategoryBadge } from "@/components/vob/category-tag";

export function LatestPopularTabs({
  locale,
  latest,
  popular,
  labels,
}: {
  locale: string;
  latest: LocalizedArticle[];
  popular: LocalizedArticle[];
  labels: { latest: string; popular: string };
}) {
  const [active, setActive] = useState<"latest" | "popular">("latest");
  const items = active === "latest" ? latest : popular;

  return (
    <section>
      <div className="flex gap-8 border-b-2 border-vob-ink">
        {(["latest", "popular"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`cursor-pointer border-b-4 pb-3 font-vob-sans text-2xl font-extrabold -mb-0.5 transition-colors ${
              active === tab
                ? "border-vob-accent text-vob-ink"
                : "border-transparent text-vob-muted hover:text-vob-ink"
            }`}
          >
            {labels[tab]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {items.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group flex gap-4 border-b border-vob-border pb-5"
          >
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden bg-vob-surface-alt">
              {article.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.coverImageUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <CategoryBadge category={article.category} locale={locale} />
              <h3 className="mt-2 line-clamp-2 font-vob-display text-lg font-bold text-vob-ink group-hover:text-vob-accent sm:text-xl">
                {article.title}
              </h3>
              <p className="mt-2 font-vob-sans text-base text-vob-muted">
                {formatDateline(article.publishedDate, locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
