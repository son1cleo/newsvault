import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { VobHeader } from "@/components/vob/vob-header";
import { VobFooter } from "@/components/vob/vob-footer";
import { ThemeScript } from "@/components/vob/theme-script";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <div
        data-locale={locale}
        className="vob flex min-h-screen flex-col bg-vob-bg text-vob-ink"
        suppressHydrationWarning
      >
        <ThemeScript />
        <VobHeader />
        <main className="flex-1">{children}</main>
        <VobFooter />
      </div>
    </NextIntlClientProvider>
  );
}
