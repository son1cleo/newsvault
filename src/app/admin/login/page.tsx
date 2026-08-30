import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm border-2 border-ink p-8">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-ink-muted">
          News Vault
        </p>
        <h1 className="mt-2 text-center font-display text-2xl font-bold text-ink">
          Admin Sign In
        </h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
