"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { JSONContent } from "@tiptap/core";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { slugify } from "@/lib/slug";
import { uploadImageFile } from "@/lib/upload-client";
import type { Article } from "@/db/schema";

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function todayInputValue() {
  return toDateInputValue(new Date());
}

export function ArticleEditorForm({ article }: { article?: Article }) {
  const router = useRouter();
  const isEditing = Boolean(article);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [author, setAuthor] = useState(article?.author ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");
  const [publishedDate, setPublishedDate] = useState(
    article ? toDateInputValue(article.publishedDate) : todayInputValue()
  );
  const [status, setStatus] = useState<"draft" | "published">(article?.status ?? "draft");
  const [body, setBody] = useState<JSONContent>((article?.body as JSONContent) ?? EMPTY_DOC);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  async function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCoverUploading(true);
    setCoverUploadError(null);
    try {
      const url = await uploadImageFile(file);
      setCoverImageUrl(url);
    } catch (err) {
      setCoverUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setCoverUploading(false);
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug,
      excerpt,
      body,
      category,
      author,
      coverImageUrl: coverImageUrl || null,
      publishedDate: new Date(`${publishedDate}T00:00:00.000Z`).toISOString(),
      status,
    };

    const url = isEditing ? `/api/admin/articles/${article!.id}` : "/api/admin/articles";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(
        typeof data.error === "string"
          ? data.error
          : "Could not save. Check the fields and try again."
      );
      setSaving(false);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-1 w-full border border-rule-strong bg-paper px-3 py-2 font-display text-xl text-ink focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
          Slug
        </label>
        <input
          id="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="mt-1 w-full border border-rule-strong bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 w-full border border-rule-strong bg-paper px-3 py-2 text-ink focus:border-ink focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
            Category
          </label>
          <input
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full border border-rule-strong bg-paper px-3 py-2 text-ink focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="author" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
            Author
          </label>
          <input
            id="author"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 w-full border border-rule-strong bg-paper px-3 py-2 text-ink focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="publishedDate" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
            Published Date (archive date)
          </label>
          <input
            id="publishedDate"
            type="date"
            required
            max={todayInputValue()}
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="mt-1 w-full border border-rule-strong bg-paper px-3 py-2 text-ink focus:border-ink focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-faint">
            This is the display date — where the article slots into the archive. It can be any
            date up to today.
          </p>
        </div>
        <div>
          <label htmlFor="coverImageUrl" className="block font-mono text-xs uppercase tracking-widest text-ink-muted">
            Cover Image
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="coverImageUrl"
              type="url"
              placeholder="https://…"
              value={coverImageUrl ?? ""}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full border border-rule-strong bg-paper px-3 py-2 text-ink focus:border-ink focus:outline-none"
            />
            <label className="flex cursor-pointer items-center whitespace-nowrap border border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-paper-deep">
              {coverUploading ? "Uploading…" : "Choose File"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleCoverFileChange}
                disabled={coverUploading}
                className="sr-only"
              />
            </label>
          </div>
          {coverUploadError && <p className="mt-1 text-xs text-accent">{coverUploadError}</p>}
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt=""
              className="mt-2 h-24 w-auto border border-rule object-cover"
            />
          )}
        </div>
      </div>

      <div>
        <span className="block font-mono text-xs uppercase tracking-widest text-ink-muted">Body</span>
        <div className="mt-1">
          <TiptapEditor content={body} onChange={setBody} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-ink pt-6">
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="status"
              checked={status === "draft"}
              onChange={() => setStatus("draft")}
            />
            Draft
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="status"
              checked={status === "published"}
              onChange={() => setStatus("published")}
            />
            Published
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer border-2 border-ink bg-ink px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Article"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}
    </form>
  );
}
