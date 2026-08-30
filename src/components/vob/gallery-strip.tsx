import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getGalleryArticles } from "@/lib/articles";

export async function GalleryStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "sections" });
  const articles = await getGalleryArticles(locale, 6);
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-vob-border pt-6">
      <h2 className="font-vob-display text-3xl font-extrabold text-vob-ink">{t("gallery")}</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group relative h-40 w-56 flex-shrink-0 overflow-hidden bg-vob-surface-alt"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl!}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <span className="line-clamp-2 font-vob-sans text-base font-medium text-white">{article.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
