"use client";

import { useParams } from "next/navigation";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SearchForm({ placeholder }: { placeholder: string }) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <form action={`/${locale}/vault`} method="get" className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-vob-faint" />
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        className="w-full border border-vob-border bg-vob-bg py-2.5 pl-10 pr-3 font-vob-sans text-lg text-vob-ink focus:border-vob-accent focus:outline-none"
      />
    </form>
  );
}
