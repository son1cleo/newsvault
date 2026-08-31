import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatFullDate } from "@/lib/date-format";
import { ThemeToggle } from "@/components/vob/theme-toggle";
import { LanguageSwitcher } from "@/components/vob/language-switcher";
import { BreakingTicker } from "@/components/vob/breaking-ticker";
import { CategoryNav } from "@/components/vob/category-nav";

export async function VobHeader() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "header" });
  const site = await getTranslations({ locale, namespace: "site" });
  const today = formatFullDate(new Date(), locale);

  return (
    <header>
      <div className="border-b border-vob-border bg-vob-bg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <span className="font-vob-sans text-base text-vob-muted">{today}</span>
          <div className="flex items-center gap-5">
            <Link href="/vault" className="font-vob-sans text-base font-medium text-vob-ink hover:text-vob-accent">
              {t("archive")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle label={t("toggleTheme")} />
          </div>
        </div>
      </div>

      <div className="border-b border-vob-border bg-vob-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-vob-accent font-vob-display text-xl font-bold text-vob-on-accent">
              স
            </span>
            <span>
              <span className="block font-vob-display text-3xl font-bold leading-tight text-vob-ink sm:text-4xl">
                {site("name")}
              </span>
              <span className="block font-vob-sans text-base text-vob-muted">{site("tagline")}</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Nav sits directly above the ticker so the ticker's own top/bottom
          rules read as one distinct strip between nav and content. */}
      <CategoryNav locale={locale} />
      <BreakingTicker locale={locale} />
    </header>
  );
}
