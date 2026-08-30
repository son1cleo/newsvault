function withPage(searchParams: URLSearchParams, page: number) {
  const next = new URLSearchParams(searchParams);
  next.set("page", String(page));
  return `/admin/articles?${next.toString()}`;
}

export function AdminPagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const params = new URLSearchParams(
    Object.entries(searchParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-6 flex items-center justify-center gap-2 font-mono text-xs">
      <a
        href={page > 1 ? withPage(params, page - 1) : undefined}
        aria-disabled={page <= 1}
        className={`border border-rule-strong px-3 py-1.5 transition-colors ${
          page <= 1 ? "pointer-events-none text-ink-faint" : "text-ink hover:bg-paper-deep"
        }`}
      >
        &lsaquo;
      </a>
      {pages.map((p) => (
        <a
          key={p}
          href={withPage(params, p)}
          className={`border px-3 py-1.5 transition-colors ${
            p === page ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink hover:bg-paper-deep"
          }`}
        >
          {p}
        </a>
      ))}
      <a
        href={page < totalPages ? withPage(params, page + 1) : undefined}
        aria-disabled={page >= totalPages}
        className={`border border-rule-strong px-3 py-1.5 transition-colors ${
          page >= totalPages ? "pointer-events-none text-ink-faint" : "text-ink hover:bg-paper-deep"
        }`}
      >
        &rsaquo;
      </a>
    </nav>
  );
}
