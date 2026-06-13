import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>CampusSport Connect · Prototyp, Hochschule Heilbronn</p>
        <nav className="flex gap-4">
          <Link href="/so-gehts" className="hover:text-ink">
            So geht&apos;s
          </Link>
          <Link href="/treffen" className="hover:text-ink">
            Sporttreffen
          </Link>
        </nav>
      </div>
    </footer>
  );
}
