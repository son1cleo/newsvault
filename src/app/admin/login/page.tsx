import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div data-locale="en" className="vob flex min-h-screen items-center justify-center bg-vob-bg px-4">
      <div className="w-full max-w-sm border-2 border-vob-ink p-8">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-vob-muted">
          Voice of Bangla
        </p>
        <h1 className="mt-2 text-center font-vob-display text-2xl font-bold text-vob-ink">
          Admin Sign In
        </h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
