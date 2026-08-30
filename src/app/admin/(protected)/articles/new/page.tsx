import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { ArticleEditorForm } from "@/components/admin/article-editor-form";

export default function NewArticlePage() {
  return (
    <div>
      <AdminBreadcrumb
        items={[
          { label: "Home", href: "/admin/articles" },
          { label: "Articles", href: "/admin/articles" },
          { label: "New" },
        ]}
      />
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">New Article</h1>
      <div className="mt-8">
        <ArticleEditorForm />
      </div>
    </div>
  );
}
