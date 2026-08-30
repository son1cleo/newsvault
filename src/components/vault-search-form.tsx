"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { monthName } from "@/lib/format";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number | null, month: number | null) {
  if (!year || !month) return 31;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function VaultSearchForm({
  years,
  categories,
  initial,
}: {
  years: number[];
  categories: string[];
  initial?: { year?: number; month?: number; day?: number; category?: string };
}) {
  const router = useRouter();
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : "");
  const [month, setMonth] = useState<string>(initial?.month ? String(initial.month) : "");
  const [day, setDay] = useState<string>(initial?.day ? String(initial.day) : "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");

  const maxDay = daysInMonth(year ? Number(year) : null, month ? Number(month) : null);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (category) {
      router.push(`/vault/${encodeURIComponent(category)}`);
      return;
    }

    if (year && month && day) {
      router.push(`/vault/${year}/${month.padStart(2, "0")}?day=${day}`);
      return;
    }
    if (year && month) {
      router.push(`/vault/${year}/${month.padStart(2, "0")}`);
      return;
    }
    if (year) {
      router.push(`/vault/${year}`);
      return;
    }
    router.push("/vault");
  }

  function handleReset() {
    setYear("");
    setMonth("");
    setDay("");
    setCategory("");
    router.push("/vault");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-wrap items-end gap-4 border-y border-rule py-4"
    >
      <div>
        <label htmlFor="search-year" className="block font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          Year
        </label>
        <select
          id="search-year"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setMonth("");
            setDay("");
          }}
          className="mt-1 cursor-pointer border border-rule-strong bg-paper px-2 py-1.5 text-sm text-ink focus:border-ink focus:outline-none"
        >
          <option value="">Any</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="search-month" className="block font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          Month
        </label>
        <select
          id="search-month"
          value={month}
          disabled={!year}
          onChange={(e) => {
            setMonth(e.target.value);
            setDay("");
          }}
          className="mt-1 cursor-pointer border border-rule-strong bg-paper px-2 py-1.5 text-sm text-ink focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Any</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {monthName(m)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="search-day" className="block font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          Day
        </label>
        <select
          id="search-day"
          value={day}
          disabled={!month}
          onChange={(e) => setDay(e.target.value)}
          className="mt-1 cursor-pointer border border-rule-strong bg-paper px-2 py-1.5 text-sm text-ink focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Any</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="search-category" className="block font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          Category
        </label>
        <select
          id="search-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 cursor-pointer border border-rule-strong bg-paper px-2 py-1.5 text-sm text-ink focus:border-ink focus:outline-none"
        >
          <option value="">Any</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="cursor-pointer border-2 border-ink bg-ink px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:bg-transparent hover:text-ink"
      >
        Search
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="cursor-pointer font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-accent transition-colors"
      >
        Reset
      </button>
    </form>
  );
}
