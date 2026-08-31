"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { JSONContent } from "@tiptap/core";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { slugify } from "@/lib/slug";
import { CATEGORY_SLUGS, categoryLabel, type CategorySlug } from "@/lib/category-labels";
import { uploadImageFile } from "@/lib/upload-client";
import type { Article } from "@/db/schema";
import type { ArticleTranslations } from "@/lib/admin-articles";

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function todayInputValue() {
  return toDateInputValue(new Date());
}

type EditableArticle = Article & { translations: ArticleTranslations };

export function ArticleEditorForm({ article }: { article?: EditableArticle }) {
  const router = useRouter();
  const isEditing = Boolean(article);

  const [activeLocale, setActiveLocale] = useState<"en" | "bn">("en");

  const [enTitle, setEnTitle] = useState(article?.translations.en.title ?? "");
  const [enExcerpt, setEnExcerpt] = useState(article?.translations.en.excerpt ?? "");
  const [enBody, setEnBody] = useState<JSONContent>(
    (article?.translations.en.body as JSONContent) ?? EMPTY_DOC
  );
  const [bnTitle, setBnTitle] = useState(article?.translations.bn.title ?? "");
  const [bnExcerpt, setBnExcerpt] = useState(article?.translations.bn.excerpt ?? "");
  const [bnBody, setBnBody] = useState<JSONContent>(
    (article?.translations.bn.body as JSONContent) ?? EMPTY_DOC
  );

  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [category, setCategory] = useState(article?.category ?? "");
  const [isCustomCategory, setIsCustomCategory] = useState(
    Boolean(article && !CATEGORY_SLUGS.includes(article.category as CategorySlug))
  );
  const [author, setAuthor] = useState(article?.author ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");
  const [publishedDate, setPublishedDate] = useState(
    article ? toDateInputValue(article.publishedDate) : todayInputValue()
  );
  const [status, setStatus] = useState<"draft" | "published">(article?.status ?? "draft");
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

  function handleEnTitleChange(value: string) {
    setEnTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      slug,
      category,
      author,
      coverImageUrl: coverImageUrl || null,
      publishedDate: new Date(`${publishedDate}T00:00:00.000Z`).toISOString(),
      status,
      translations: {
        en: { title: enTitle, excerpt: enExcerpt, body: enBody },
        bn: { title: bnTitle, excerpt: bnExcerpt, body: bnBody },
      },
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
      <div className="flex gap-2 border-b-2 border-vob-ink font-mono text-xs uppercase tracking-widest">
        {(["en", "bn"] as const).map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setActiveLocale(locale)}
            className={`cursor-pointer border-b-2 px-4 py-2.5 -mb-0.5 transition-colors ${
              activeLocale === locale
                ? "border-vob-accent text-vob-ink"
                : "border-transparent text-vob-muted hover:text-vob-ink"
            }`}
          >
            {locale === "en" ? "English" : "বাংলা (Bangla)"}
          </button>
        ))}
      </div>

      <div className={activeLocale === "en" ? "space-y-6" : "hidden space-y-6"}>
        <div>
          <label htmlFor="en-title" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Title (English)
          </label>
          <input
            id="en-title"
            required={activeLocale === "en"}
            value={enTitle}
            onChange={(e) => handleEnTitleChange(e.target.value)}
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 font-vob-display text-xl text-vob-ink focus:border-vob-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="en-excerpt" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Excerpt (English)
          </label>
          <textarea
            id="en-excerpt"
            required={activeLocale === "en"}
            rows={2}
            value={enExcerpt}
            onChange={(e) => setEnExcerpt(e.target.value)}
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
          />
        </div>
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-vob-muted">Body (English)</span>
          <div className="mt-1">
            <TiptapEditor content={enBody} onChange={setEnBody} />
          </div>
        </div>
      </div>

      <div className={activeLocale === "bn" ? "space-y-6" : "hidden space-y-6"}>
        <div>
          <label htmlFor="bn-title" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Title (Bangla)
          </label>
          <input
            id="bn-title"
            required={activeLocale === "bn"}
            value={bnTitle}
            onChange={(e) => setBnTitle(e.target.value)}
            lang="bn"
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 font-vob-display text-xl text-vob-ink focus:border-vob-accent focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="bn-excerpt" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Excerpt (Bangla)
          </label>
          <textarea
            id="bn-excerpt"
            required={activeLocale === "bn"}
            rows={2}
            value={bnExcerpt}
            onChange={(e) => setBnExcerpt(e.target.value)}
            lang="bn"
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
          />
        </div>
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-vob-muted">Body (Bangla)</span>
          <div className="mt-1">
            <TiptapEditor content={bnBody} onChange={setBnBody} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="slug" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
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
          className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 font-mono text-sm text-vob-ink focus:border-vob-accent focus:outline-none"
        />
        <p className="mt-1 text-xs text-vob-faint">Shared across both languages — generated from the English title.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Category
          </label>
          <select
            id="category"
            required
            value={isCustomCategory ? "__custom__" : category}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setIsCustomCategory(true);
                setCategory("");
              } else {
                setIsCustomCategory(false);
                setCategory(e.target.value);
              }
            }}
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
          >
            <option value="" disabled>
              Select a category…
            </option>
            {CATEGORY_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {categoryLabel(slug, "en")}
              </option>
            ))}
            <option value="__custom__">+ Add new category…</option>
          </select>
          {isCustomCategory && (
            <input
              id="category-custom"
              required
              autoFocus
              value={category}
              onChange={(e) => setCategory(slugify(e.target.value))}
              placeholder="e.g. climate, health, opinion…"
              className="mt-2 w-full border border-vob-border bg-vob-bg px-3 py-2 font-mono text-sm text-vob-ink focus:border-vob-accent focus:outline-none"
            />
          )}
          {isCustomCategory && (
            <p className="mt-1 text-xs text-vob-faint">
              New categories won&apos;t appear in the main navigation or homepage rails
              automatically, but their articles are filterable at /vault/{category || "…"}.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="author" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Author
          </label>
          <input
            id="author"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="publishedDate" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Published Date (archive date)
          </label>
          <input
            id="publishedDate"
            type="date"
            required
            max={todayInputValue()}
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
          />
          <p className="mt-1 text-xs text-vob-faint">
            This is the display date — where the article slots into the archive. It can be any
            date up to today.
          </p>
        </div>
        <div>
          <label htmlFor="coverImageUrl" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
            Cover Image
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="coverImageUrl"
              type="url"
              placeholder="https://…"
              value={coverImageUrl ?? ""}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
            />
            <label className="flex cursor-pointer items-center whitespace-nowrap border border-vob-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-vob-ink transition-colors hover:bg-vob-surface-alt">
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
          {coverUploadError && <p className="mt-1 text-xs text-vob-accent">{coverUploadError}</p>}
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt=""
              className="mt-2 h-24 w-auto border border-vob-border object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-vob-ink pt-6">
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
          className="cursor-pointer bg-vob-accent px-6 py-3 font-mono text-sm uppercase tracking-widest text-vob-on-accent transition-colors hover:bg-vob-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Article"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-vob-accent">
          {error}
        </p>
      )}
    </form>
  );
}
