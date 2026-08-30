import Link from "next/link";
import type { Article } from "@/db/schema";
import { formatShortDate } from "@/lib/format";

export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block border-b border-rule py-6 transition-colors hover:bg-paper-deep"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
        <time dateTime={article.publishedDate.toISOString()}>
          {formatShortDate(article.publishedDate)}
        </time>
        <span aria-hidden="true">&middot;</span>
        <span className="text-accent">{article.category}</span>
      </div>
      <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink group-hover:text-accent transition-colors">
        {article.title}
      </h3>
      <p className="mt-2 max-w-3xl text-ink-muted">{article.excerpt}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        By {article.author}
      </p>
    </Link>
  );
}
