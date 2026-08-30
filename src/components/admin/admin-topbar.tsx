import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";
import { SearchIcon } from "@/components/admin/icons";

export function AdminTopBar({ adminEmail }: { adminEmail: string }) {
  const initials = adminEmail.slice(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-rule bg-paper px-4 py-4 sm:px-6">
      <form action="/admin/articles" method="get" className="relative min-w-0 w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          name="q"
          placeholder="Search articles…"
          className="w-full border border-rule-strong bg-paper py-2 pl-9 pr-3 text-base text-ink focus:border-ink focus:outline-none"
        />
      </form>

      <div className="flex flex-shrink-0 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center bg-ink font-mono text-xs font-semibold text-paper">
          {initials}
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-widest text-ink-muted sm:inline">
          {adminEmail}
        </span>
        <AdminMobileMenu />
      </div>
    </header>
  );
}
