"use client";

import { Link, usePathname } from "@/i18n/navigation";

export type NavItem = { href: string; label: string; exact?: boolean };

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function NavLinksBar({
  items,
  orientation = "row",
}: {
  items: NavItem[];
  orientation?: "row" | "col";
}) {
  const pathname = usePathname();

  if (orientation === "col") {
    return (
      <>
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 font-vob-sans text-lg font-semibold transition-colors ${
                active ? "bg-vob-accent text-vob-on-accent" : "text-vob-ink hover:text-vob-accent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <>
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-shrink-0 whitespace-nowrap px-5 py-2.5 font-vob-sans text-lg font-semibold transition-colors ${
              active
                ? "bg-vob-accent text-vob-on-accent"
                : "text-vob-ink hover:text-vob-accent"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
