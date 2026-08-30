"use client";

import Link from "next/link";
import { ArticleIcon, ExternalLinkIcon, LogoutIcon } from "@/components/admin/icons";
import { LogoutButton } from "@/components/admin/logout-button";
import { NavDrawer } from "@/components/nav-drawer";

export function AdminMobileMenu() {
  return (
    <NavDrawer label="Admin Menu" variant="dark" buttonClassName="lg:hidden">
      <nav className="flex flex-col gap-1 pt-2 text-sm">
        <Link href="/admin/articles" className="flex items-center gap-3 py-3 text-paper/80 hover:text-paper">
          <ArticleIcon className="h-4 w-4" />
          Articles
        </Link>
        <Link href="/vault" className="flex items-center gap-3 py-3 text-paper/60 hover:text-paper">
          <ExternalLinkIcon className="h-4 w-4" />
          View Site
        </Link>
        <div className="flex items-center gap-3 py-3 text-paper/60 hover:text-paper">
          <LogoutIcon className="h-4 w-4" />
          <LogoutButton className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
      </nav>
    </NavDrawer>
  );
}
