"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon, MenuIcon } from "@/components/icons";

const VARIANT_STYLES = {
  light: {
    button: "text-ink hover:text-accent",
    panel: "bg-paper text-ink border-l border-ink",
    close: "text-ink hover:text-accent",
  },
  dark: {
    button: "text-paper/70 hover:text-paper",
    panel: "bg-ink text-paper border-l border-paper/20",
    close: "text-paper/70 hover:text-paper",
  },
} as const;

export function NavDrawer({
  label,
  variant = "light",
  buttonClassName,
  children,
}: {
  label: string;
  variant?: "light" | "dark";
  buttonClassName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const styles = VARIANT_STYLES[variant];

  // Close automatically on navigation so the drawer doesn't stay open
  // after a link is tapped.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${label}`}
        aria-expanded={open}
        className={`cursor-pointer transition-colors ${styles.button} ${buttonClassName ?? ""}`}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label={`Close ${label}`}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 cursor-pointer bg-ink/50"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          } ${styles.panel}`}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <span className="font-mono text-xs uppercase tracking-widest opacity-60">{label}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              className={`cursor-pointer transition-colors ${styles.close}`}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 px-5 pb-6">{children}</div>
        </div>
      </div>
    </>
  );
}
