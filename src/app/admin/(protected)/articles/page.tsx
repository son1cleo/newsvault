import Link from "next/link";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { ArticlesTable } from "@/components/admin/articles-table";
import { PlusIcon } from "@/components/admin/icons";
import { getAdminArticlesPage, getAdminAuthors, getAdminCategories } from "@/lib/admin-articles";

const TABS = [
  { label: "All", value: undefined },
  { label: "Published", value: "published" as const },
  { label: "Drafts", value: "draft" as const },
];

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    author?: string;
    date?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const status = params.status === "published" || params.status === "draft" ? params.status : undefined;
  const page = params.page ? Math.max(1, Number(params.page) || 1) : 1;

  const [{ articles, total, totalPages }, categories, authors] = await Promise.all([
    getAdminArticlesPage({
      q: params.q,
      status,
      category: params.category,
      author: params.author,
      date: params.date,
      page,
    }),
    getAdminCategories(),
    getAdminAuthors(),
  ]);

  function tabHref(value?: string) {
    const next = new URLSearchParams();
    if (value) next.set("status", value);
    if (params.q) next.set("q", params.q);
    const qs = next.toString();
    return qs ? `/admin/articles?${qs}` : "/admin/articles";
  }

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Home", href: "/admin/articles" }, { label: "Articles" }]} />

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-vob-display text-3xl font-bold text-vob-ink">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="flex cursor-pointer items-center gap-2 bg-vob-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-vob-on-accent transition-colors hover:bg-vob-accent-hover"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          New Article
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-vob-border font-mono text-xs uppercase tracking-widest">
        {TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <Link
              key={tab.label}
              href={tabHref(tab.value)}
              className={`border-b-2 pb-3 transition-colors ${
                active ? "border-vob-accent text-vob-ink" : "border-transparent text-vob-muted hover:text-vob-ink"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <AdminFilterBar
        categories={categories}
        authors={authors}
        current={{ status, category: params.category, author: params.author, date: params.date, q: params.q }}
      />

      <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-vob-faint">
        {total} article{total === 1 ? "" : "s"}
      </p>

      <div className="mt-3">
        <ArticlesTable articles={articles} />
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        searchParams={{ status, category: params.category, author: params.author, date: params.date, q: params.q }}
      />
    </div>
  );
}
