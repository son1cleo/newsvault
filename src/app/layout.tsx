import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  Playfair_Display,
  Public_Sans,
  JetBrains_Mono,
  Noto_Serif_Bengali,
  Noto_Sans_Bengali,
} from "next/font/google";
import "./globals.css";

// Legacy tokens — still used by /admin's existing ink/paper theme, which is
// intentionally left as-is by this rebrand (see project notes).
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Voice of Time (public site) typefaces.
const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Voice of Time | সময়কণ্ঠ",
    template: "%s",
  },
  description: "সত্যের পথে, মানুষের পাশে — Voice of Time, an independent bilingual news archive.",
  openGraph: {
    siteName: "Voice of Time",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${playfairDisplay.variable} ${publicSans.variable} ${jetbrainsMono.variable} ${notoSerifBengali.variable} ${notoSansBengali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
