import { ChevronDownIcon } from "@/components/admin/icons";

export function AdminFilterBar({
  categories,
  authors,
  current,
}: {
  categories: string[];
  authors: string[];
  current: { status?: string; category?: string; author?: string; date?: string; q?: string };
}) {
  return (
    <form
      action="/admin/articles"
      method="get"
      className="flex flex-wrap items-center gap-3 border-y border-vob-border py-4"
    >
      {current.status && <input type="hidden" name="status" value={current.status} />}
      {current.q && <input type="hidden" name="q" value={current.q} />}

      <div className="relative">
        <input
          type="date"
          name="date"
          defaultValue={current.date ?? ""}
          className="border border-vob-border bg-vob-bg px-3 py-1.5 pr-8 text-base text-vob-ink focus:border-vob-accent focus:outline-none"
        />
      </div>

      <div className="relative">
        <select
          name="category"
          defaultValue={current.category ?? ""}
          className="cursor-pointer appearance-none border border-vob-border bg-vob-bg px-3 py-1.5 pr-8 text-base text-vob-ink focus:border-vob-accent focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-vob-faint" />
      </div>

      <div className="relative">
        <select
          name="author"
          defaultValue={current.author ?? ""}
          className="cursor-pointer appearance-none border border-vob-border bg-vob-bg px-3 py-1.5 pr-8 text-base text-vob-ink focus:border-vob-accent focus:outline-none"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-vob-faint" />
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-vob-accent px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-vob-on-accent transition-colors hover:bg-vob-accent-hover"
      >
        Filter
      </button>
      {(current.category || current.author || current.date || current.q) && (
        <a
          href={current.status ? `/admin/articles?status=${current.status}` : "/admin/articles"}
          className="font-mono text-xs uppercase tracking-widest text-vob-muted hover:text-vob-accent transition-colors"
        >
          Clear
        </a>
      )}
    </form>
  );
}
