import { getRecentArticles } from "@/lib/articles";
import { LeadStoryCard, SideStoryCard } from "@/components/vob/article-cards";

export async function HeroSection({ locale }: { locale: string }) {
  const articles = await getRecentArticles(locale, 4);
  if (articles.length === 0) return null;

  const [lead, ...side] = articles;

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <LeadStoryCard article={lead} locale={locale} />
      <div className="flex flex-col gap-5">
        {side.map((article) => (
          <SideStoryCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </section>
  );
}
