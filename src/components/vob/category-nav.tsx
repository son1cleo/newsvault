import { getTranslations } from "next-intl/server";
import { CATEGORY_SLUGS, categoryLabel } from "@/lib/category-labels";
import { NavDrawer } from "@/components/nav-drawer";
import { SearchForm } from "@/components/vob/search-form";
import { NavLinksBar, type NavItem } from "@/components/vob/nav-links-bar";

export async function CategoryNav({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tHeader = await getTranslations({ locale, namespace: "header" });

  const items: NavItem[] = [
    { href: "/", label: t("home"), exact: true },
    ...CATEGORY_SLUGS.map((slug) => ({ href: `/vault/${slug}`, label: categoryLabel(slug, locale) })),
  ];

  return (
    <nav className="bg-vob-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <div className="lg:hidden">
          <NavDrawer label={tHeader("menu")} variant="vob" buttonClassName="text-vob-ink hover:text-vob-accent">
            <nav className="mt-2 flex flex-col gap-1">
              <NavLinksBar items={items} orientation="col" />
            </nav>
          </NavDrawer>
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-x-1 overflow-x-auto lg:flex">
          <NavLinksBar items={items} orientation="row" />
        </div>
        <div className="ml-auto flex w-full max-w-[220px] flex-shrink-0 items-center lg:ml-0 lg:w-auto">
          <SearchForm placeholder={tHeader("searchPlaceholder")} />
        </div>
      </div>
    </nav>
  );
}
