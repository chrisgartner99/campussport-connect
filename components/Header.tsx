import Link from "next/link";

const navItems = [
  { href: "/treffen", label: "Sporttreffen" },
  { href: "/mitspieler", label: "Mitspieler" },
  { href: "/meine-treffen", label: "Meine Treffen" },
];

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          CampusSport Connect
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-zinc-600 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
