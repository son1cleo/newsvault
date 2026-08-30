"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArticleIcon, ExternalLinkIcon, LogoutIcon } from "@/components/admin/icons";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminSidebar() {
  const pathname = usePathname();
  const articlesActive = pathname?.startsWith("/admin/articles");

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col self-start bg-ink text-paper lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center border border-paper/40 font-display text-sm font-bold">
          NV
        </span>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide">News Vault</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/50">Admin</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 px-3">
        <p className="px-3 font-mono text-[10px] uppercase tracking-widest text-paper/40">Main</p>
        <Link
          href="/admin/articles"
          className={`mt-2 flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors ${
            articlesActive
              ? "border-accent bg-paper/5 text-paper"
              : "border-transparent text-paper/60 hover:bg-paper/5 hover:text-paper"
          }`}
        >
          <ArticleIcon className="h-4 w-4" />
          Articles
        </Link>
      </nav>

      <div className="border-t border-paper/10 px-3 py-4">
        <Link
          href="/vault"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          View Site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper">
          <LogoutIcon className="h-4 w-4" />
          <LogoutButton className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </div>

      <p className="border-t border-paper/10 px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-paper/30">
        &copy; News Vault {new Date().getFullYear()}
      </p>
    </aside>
  );
}
