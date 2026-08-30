import Link from "next/link";
import { getCategories } from "@/lib/articles";
import { MastheadMark } from "@/components/masthead-mark";
import { NavDrawer } from "@/components/nav-drawer";

export async function SiteHeader() {
  const categories = await getCategories();
  const today = new Date();

  const navLinks = (
    <>
      <Link href="/vault" className="py-2 text-ink hover:text-accent transition-colors md:py-0">
        All Dispatches
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/vault/${encodeURIComponent(category)}`}
          className="py-2 text-ink-muted hover:text-accent transition-colors md:py-0"
        >
          {category}
        </Link>
      ))}
    </>
  );

  return (
    <header className="border-b-4 border-double border-ink bg-paper">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-3 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted sm:text-[11px]">
          <span>Vol. I &middot; An Archive of Record</span>
          <span>
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="relative mt-2 flex items-center justify-center">
          <span className="md:hidden">
            <MastheadMark size="compact" />
          </span>
          <span className="hidden md:block">
            <MastheadMark size="large" />
          </span>
          <div className="absolute right-0 md:hidden">
            <NavDrawer label="Menu" variant="light">
              <nav className="flex flex-col gap-1 pt-2 font-mono text-sm uppercase tracking-widest">
                {navLinks}
              </nav>
            </NavDrawer>
          </div>
        </div>
      </div>
      <nav className="hidden border-t border-rule-strong md:block">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3 font-mono text-xs uppercase tracking-widest sm:px-6">
          {navLinks}
        </div>
      </nav>
    </header>
  );
}
