import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRecentArticles } from "@/lib/articles";

export async function BreakingTicker({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "ticker" });
  const items = await getRecentArticles(locale, 6);

  if (items.length === 0) return null;

  // Duplicate the list so the CSS marquee (translateX -50%) loops seamlessly.
  const looped = [...items, ...items];

  return (
    <section className="border-t border-b border-vob-border bg-vob-accent">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <span className="flex-shrink-0 border border-vob-on-accent px-2.5 py-1 font-vob-sans text-base font-bold uppercase tracking-widest text-vob-on-accent">
          {t("label")}
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="vob-ticker-track flex w-max gap-10 whitespace-nowrap">
            {looped.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={`/article/${item.slug}`}
                className="font-vob-sans text-base text-vob-on-accent/95 hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
