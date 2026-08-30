"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;
  const target = currentLocale === "bn" ? "en" : "bn";
  const label = currentLocale === "bn" ? "English" : "বাংলা";

  return (
    <Link
      href={pathname}
      locale={target}
      className="font-vob-sans text-sm font-medium text-vob-ink transition-colors hover:text-vob-accent"
    >
      {label}
    </Link>
  );
}
