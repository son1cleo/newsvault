import Link from "next/link";

// Icon/favicon mark from the logo spec (pictures/News Vault logo design.pdf):
// bordered square, "NV", underline rule. Used where the full wordmark
// doesn't fit — narrow viewports, tight UI chrome.
function CompactMark() {
  return (
    <span className="flex flex-col items-center border border-ink px-3 py-1.5">
      <span className="font-display text-xl font-black leading-none text-ink">NV</span>
      <span className="mt-1 h-px w-5 bg-ink" />
    </span>
  );
}

export function MastheadMark({
  size = "default",
  asLink = true,
}: {
  size?: "default" | "large" | "compact";
  asLink?: boolean;
}) {
  const textSize = size === "large" ? "text-5xl sm:text-7xl" : "text-3xl sm:text-4xl";

  const wordmark =
    size === "compact" ? (
      <CompactMark />
    ) : (
      <span
        className={`block whitespace-nowrap font-display font-black uppercase tracking-wide text-ink ${textSize}`}
      >
        News Vault
      </span>
    );

  if (!asLink) return wordmark;

  return (
    <Link href="/" className="inline-block">
      {wordmark}
    </Link>
  );
}
