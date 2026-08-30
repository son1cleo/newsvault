"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArticleIcon, ExternalLinkIcon, LogoutIcon } from "@/components/admin/icons";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminSidebar() {
  const pathname = usePathname();
  const articlesActive = pathname?.startsWith("/admin/articles");

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col self-start bg-vob-sidebar text-vob-sidebar-ink lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center border border-vob-sidebar-ink/40 font-vob-display text-sm font-bold">
          VB
        </span>
        <div>
          <p className="font-vob-display text-sm font-bold uppercase tracking-wide">Voice of Bangla</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-vob-sidebar-muted">Admin</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 px-3">
        <p className="px-3 font-mono text-[10px] uppercase tracking-widest text-vob-sidebar-muted">Main</p>
        <Link
          href="/admin/articles"
          className={`mt-2 flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors ${
            articlesActive
              ? "border-vob-accent bg-vob-sidebar-hover text-vob-sidebar-ink"
              : "border-transparent text-vob-sidebar-muted hover:bg-vob-sidebar-hover hover:text-vob-sidebar-ink"
          }`}
        >
          <ArticleIcon className="h-4 w-4" />
          Articles
        </Link>
      </nav>

      <div className="border-t border-vob-sidebar-border px-3 py-4">
        <Link
          href="/vault"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-vob-sidebar-muted transition-colors hover:bg-vob-sidebar-hover hover:text-vob-sidebar-ink"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          View Site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-vob-sidebar-muted transition-colors hover:bg-vob-sidebar-hover hover:text-vob-sidebar-ink">
          <LogoutIcon className="h-4 w-4" />
          <LogoutButton className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </div>

      <p className="border-t border-vob-sidebar-border px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-vob-sidebar-muted">
        &copy; Voice of Bangla {new Date().getFullYear()}
      </p>
    </aside>
  );
}
