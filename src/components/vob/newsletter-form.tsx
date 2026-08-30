"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({
  title,
  body,
  placeholder,
  cta,
}: {
  title: string;
  body: string;
  placeholder: string;
  cta: string;
}) {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <div className="border border-vob-accent bg-vob-surface p-5">
      <h3 className="font-vob-display text-2xl font-bold text-vob-ink">{title}</h3>
      <p className="mt-2.5 font-vob-sans text-base text-vob-muted">{body}</p>
      {subscribed ? (
        <p className="mt-4 font-vob-sans text-lg font-medium text-vob-accent">{cta} ✓</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder={placeholder}
            className="border border-vob-border bg-vob-bg px-4 py-3 font-vob-sans text-lg text-vob-ink focus:border-vob-accent focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer bg-vob-accent px-4 py-3 font-vob-sans text-lg font-bold text-vob-on-accent transition-colors hover:bg-vob-accent-hover"
          >
            {cta}
          </button>
        </form>
      )}
    </div>
  );
}
