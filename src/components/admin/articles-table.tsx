"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminArticleListItem } from "@/lib/admin-articles";
import { formatShortDate } from "@/lib/format";

export function ArticlesTable({ articles }: { articles: AdminArticleListItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allSelected = articles.length > 0 && selected.size === articles.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(articles.map((a) => a.id)));
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function deleteOne(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteSelected() {
    if (!window.confirm(`Delete ${selected.size} article${selected.size === 1 ? "" : "s"}? This cannot be undone.`))
      return;
    setDeleting(true);
    await fetch("/api/admin/articles/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setDeleting(false);
    setSelected(new Set());
    router.refresh();
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between border border-vob-ink bg-vob-surface px-4 py-2.5">
          <span className="font-mono text-sm uppercase tracking-widest text-vob-ink">
            {selected.size} selected
          </span>
          <button
            type="button"
            onClick={deleteSelected}
            disabled={deleting}
            className="cursor-pointer font-mono text-sm uppercase tracking-widest text-vob-accent hover:text-vob-accent-hover transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete Selected"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-vob-ink font-mono text-xs uppercase tracking-widest text-vob-muted">
              <th className="w-10 py-2.5 pr-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all articles"
                  className="cursor-pointer"
                />
              </th>
              <th className="py-2.5 pr-4">Title</th>
              <th className="py-2.5 pr-4">Author</th>
              <th className="py-2.5 pr-4">Category</th>
              <th className="py-2.5 pr-4">Date</th>
              <th className="py-2.5 pr-4">Status</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-vob-muted">
                  No articles found.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-b border-vob-border align-top">
                  <td className="py-3 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.has(article.id)}
                      onChange={() => toggleOne(article.id)}
                      aria-label={`Select ${article.title}`}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-vob-display text-lg font-semibold text-vob-ink">{article.title}</p>
                    <p className="mt-0.5 max-w-md truncate text-[15px] text-vob-muted">{article.excerpt}</p>
                  </td>
                  <td className="py-3 pr-4 text-base text-vob-muted">{article.author}</td>
                  <td className="py-3 pr-4">
                    <span className="border border-vob-border px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-vob-muted">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-base text-vob-muted">
                    {formatShortDate(article.publishedDate)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-mono text-xs uppercase tracking-widest ${
                        article.status === "published" ? "text-vob-accent" : "text-vob-faint"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-mono text-xs uppercase tracking-widest text-vob-ink hover:text-vob-accent transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteOne(article.id, article.title)}
                        className="cursor-pointer font-mono text-xs uppercase tracking-widest text-vob-accent hover:text-vob-accent-hover transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
