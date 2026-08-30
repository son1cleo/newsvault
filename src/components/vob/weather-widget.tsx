import { getLocale } from "next-intl/server";
import { localizedNumber } from "@/lib/date-format";

// Static/decorative — no live weather API is wired up (matches the reference
// site, which also displays fixed demo weather data).
export async function WeatherWidget({ title }: { title: string }) {
  const locale = await getLocale();

  return (
    <div className="border border-vob-border bg-vob-surface p-5">
      <h3 className="font-vob-display text-2xl font-bold text-vob-ink">{title}</h3>
      <div className="mt-3 flex items-center gap-4">
        <span className="text-5xl" aria-hidden="true">
          ☀️
        </span>
        <div>
          <p className="font-vob-display text-4xl font-bold text-vob-ink">{localizedNumber(30, locale)}°</p>
          <p className="font-vob-sans text-base text-vob-muted">{locale === "bn" ? "ঢাকা" : "Dhaka"}</p>
        </div>
      </div>
      <p className="mt-2.5 font-vob-sans text-base text-vob-muted">
        {locale === "bn"
          ? `আংশিক মেঘলা · আর্দ্রতা ${localizedNumber(72, locale)}%`
          : `Partly cloudy · ${localizedNumber(72, locale)}% humidity`}
      </p>
    </div>
  );
}
