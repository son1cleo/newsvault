import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CATEGORY_SLUGS, categoryLabel } from "@/lib/category-labels";

export async function VobFooter() {
  const locale = await getLocale();
  const site = await getTranslations({ locale, namespace: "site" });
  const footer = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="border-t border-vob-border bg-vob-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-vob-display text-2xl font-bold text-vob-ink">{site("name")}</p>
          <p className="mt-2.5 font-vob-sans text-base text-vob-muted">{footer("aboutBody")}</p>
        </div>

        <div>
          <p className="font-vob-sans text-sm font-semibold uppercase tracking-widest text-vob-muted">
            {footer("about")}
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {CATEGORY_SLUGS.slice(0, 5).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/vault/${slug}`}
                  className="font-vob-sans text-base text-vob-ink hover:text-vob-accent"
                >
                  {categoryLabel(slug, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-vob-sans text-sm font-semibold uppercase tracking-widest text-vob-muted">
            {footer("contact")}
          </p>
          <p className="mt-3 font-vob-sans text-base text-vob-ink">contact@voiceoftime.example</p>
          <p className="mt-4 font-vob-sans text-sm font-semibold uppercase tracking-widest text-vob-muted">
            {footer("social")}
          </p>
          <div className="mt-3 flex gap-4 font-vob-sans text-base text-vob-ink">
            <span className="hover:text-vob-accent">Facebook</span>
            <span className="hover:text-vob-accent">YouTube</span>
            <span className="hover:text-vob-accent">X</span>
          </div>
        </div>
      </div>

      <div className="border-t border-vob-border px-4 py-4 text-center font-vob-sans text-sm text-vob-muted sm:px-6">
        {footer("editorCredit")} &middot; &copy; {new Date().getFullYear()} {site("name")} &middot; {footer("rights")}
      </div>
    </footer>
  );
}
