"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sign in failed.");
      setLoading(false);
      return;
    }

    const from = searchParams.get("from");
    router.push(from && from.startsWith("/admin") ? from : "/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-mono text-xs uppercase tracking-widest text-vob-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border border-vob-border bg-vob-bg px-3 py-2 text-vob-ink focus:border-vob-accent focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-vob-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-vob-accent px-4 py-3 font-mono text-sm uppercase tracking-widest text-vob-on-accent transition-colors hover:bg-vob-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
