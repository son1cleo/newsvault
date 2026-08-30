"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { categoryLabel } from "@/lib/category-labels";
import { monthNameLocalized, localizedNumber } from "@/lib/date-format";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number | null, month: number | null) {
  if (!year || !month) return 31;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function VaultSearchForm({
  locale,
  years,
  categories,
  initial,
}: {
  locale: string;
  years: number[];
  categories: string[];
  initial?: { year?: number; month?: number; day?: number; category?: string };
}) {
  const router = useRouter();
  const t = useTranslations("common");
  const [year, setYear] = useState(initial?.year ? String(initial.year) : "");
  const [month, setMonth] = useState(initial?.month ? String(initial.month) : "");
  const [day, setDay] = useState(initial?.day ? String(initial.day) : "");
  const [category, setCategory] = useState(initial?.category ?? "");

  const maxDay = daysInMonth(year ? Number(year) : null, month ? Number(month) : null);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (category) return router.push(`/vault/${category}`);
    if (year && month && day) return router.push(`/vault/${year}/${month.padStart(2, "0")}?day=${day}`);
    if (year && month) return router.push(`/vault/${year}/${month.padStart(2, "0")}`);
    if (year) return router.push(`/vault/${year}`);
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
    <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-5 border-y border-vob-border py-5">
      <div>
        <label className="block font-vob-sans text-base font-semibold text-vob-muted">{t("year")}</label>
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setMonth("");
            setDay("");
          }}
          className="mt-1 cursor-pointer border border-vob-border bg-vob-bg px-4 py-3 text-lg text-vob-ink focus:border-vob-accent focus:outline-none"
        >
          <option value="">{t("any")}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {localizedNumber(y, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-vob-sans text-base font-semibold text-vob-muted">{t("month")}</label>
        <select
          value={month}
          disabled={!year}
          onChange={(e) => {
            setMonth(e.target.value);
            setDay("");
          }}
          className="mt-1 cursor-pointer border border-vob-border bg-vob-bg px-4 py-3 text-lg text-vob-ink focus:border-vob-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{t("any")}</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {monthNameLocalized(m, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-vob-sans text-base font-semibold text-vob-muted">{t("day")}</label>
        <select
          value={day}
          disabled={!month}
          onChange={(e) => setDay(e.target.value)}
          className="mt-1 cursor-pointer border border-vob-border bg-vob-bg px-4 py-3 text-lg text-vob-ink focus:border-vob-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{t("any")}</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {localizedNumber(d, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-vob-sans text-base font-semibold text-vob-muted">{t("category")}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 cursor-pointer border border-vob-border bg-vob-bg px-4 py-3 text-lg text-vob-ink focus:border-vob-accent focus:outline-none"
        >
          <option value="">{t("any")}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c, locale)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-vob-accent px-7 py-3 font-vob-sans text-lg font-bold text-vob-on-accent transition-colors hover:bg-vob-accent-hover"
      >
        {t("search")}
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="cursor-pointer font-vob-sans text-lg font-medium text-vob-muted hover:text-vob-accent"
      >
        {t("reset")}
      </button>
    </form>
  );
}
