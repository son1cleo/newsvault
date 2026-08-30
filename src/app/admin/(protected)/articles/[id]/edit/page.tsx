import { notFound } from "next/navigation";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { ArticleEditorForm } from "@/components/admin/article-editor-form";
import { getArticleByIdForAdmin } from "@/lib/admin-articles";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const article = await getArticleByIdForAdmin(id);
  if (!article) notFound();

  return (
    <div>
      <AdminBreadcrumb
        items={[
          { label: "Home", href: "/admin/articles" },
          { label: "Articles", href: "/admin/articles" },
          { label: "Edit" },
        ]}
      />
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">Edit Article</h1>
      <div className="mt-8">
        <ArticleEditorForm article={article} />
      </div>
    </div>
  );
}
