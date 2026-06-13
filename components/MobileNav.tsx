import Link from "next/link";

type Item = { href: string; label: string };

/** Aufklappbare Navigation für kleine Screens (ohne Client-JS). */
export default function MobileNav({ items }: { items: Item[] }) {
  return (
    <details className="relative md:hidden">
      <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-line text-ink [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menü öffnen</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </summary>
      <div className="absolute right-0 z-40 mt-2 w-52 rounded-card border border-line bg-surface py-1 shadow-pop">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
