import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";
import { SearchIcon } from "@/components/admin/icons";

export function AdminTopBar({ adminEmail }: { adminEmail: string }) {
  const initials = adminEmail.slice(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-vob-border bg-vob-bg px-4 py-4 sm:px-6">
      <form action="/admin/articles" method="get" className="relative min-w-0 w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vob-faint" />
        <input
          type="search"
          name="q"
          placeholder="Search articles…"
          className="w-full border border-vob-border bg-vob-bg py-2 pl-9 pr-3 text-base text-vob-ink focus:border-vob-accent focus:outline-none"
        />
      </form>

      <div className="flex flex-shrink-0 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center bg-vob-sidebar font-mono text-xs font-semibold text-vob-sidebar-ink">
          {initials}
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-widest text-vob-muted sm:inline">
          {adminEmail}
        </span>
        <AdminMobileMenu />
      </div>
    </header>
  );
}
