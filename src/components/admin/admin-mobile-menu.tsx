"use client";

import Link from "next/link";
import { ArticleIcon, ExternalLinkIcon, LogoutIcon } from "@/components/admin/icons";
import { LogoutButton } from "@/components/admin/logout-button";
import { NavDrawer } from "@/components/nav-drawer";

export function AdminMobileMenu() {
  return (
    <NavDrawer label="Admin Menu" variant="navy" buttonClassName="lg:hidden">
      <nav className="flex flex-col gap-1 pt-2 text-sm">
        <Link
          href="/admin/articles"
          className="flex items-center gap-3 py-3 text-vob-sidebar-ink/90 hover:text-vob-sidebar-ink"
        >
          <ArticleIcon className="h-4 w-4" />
          Articles
        </Link>
        <Link href="/vault" className="flex items-center gap-3 py-3 text-vob-sidebar-muted hover:text-vob-sidebar-ink">
          <ExternalLinkIcon className="h-4 w-4" />
          View Site
        </Link>
        <div className="flex items-center gap-3 py-3 text-vob-sidebar-muted hover:text-vob-sidebar-ink">
          <LogoutIcon className="h-4 w-4" />
          <LogoutButton className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </nav>
    </NavDrawer>
  );
}
