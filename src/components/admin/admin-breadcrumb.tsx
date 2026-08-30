import Link from "next/link";

export function AdminBreadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="font-mono text-xs uppercase tracking-widest text-vob-muted">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span className="mx-2 text-vob-faint">&rsaquo;</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-vob-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-vob-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
