import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "@/components/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { buttonClasses } from "@/components/ui/Button";

const publicNav = [
  { href: "/treffen", label: "Sporttreffen" },
  { href: "/mitspieler", label: "Mitspieler" },
  { href: "/meine-treffen", label: "Meine Treffen" },
  { href: "/so-gehts", label: "So geht's" },
];

// Zusätzliche Einträge nur für eingeloggte Nutzer.
const authNav = [
  { href: "/freunde", label: "Freunde" },
  { href: "/chat", label: "Chat" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let vorname: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();
    const name =
      profile?.name ??
      user.user_metadata?.name?.toString() ??
      user.email ??
      "Profil";
    vorname = name.split(" ")[0];
  }

  const items = [...publicNav, ...(vorname ? authNav : [])];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-strong text-on-brand"
          >
            {/* Stilisierter Aktivitäts-/Puls-Marker als Logo-Platzhalter */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l2 6 4-14 2 8h6" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            CampusSport <span className="text-brand-strong">Connect</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <div className="mr-2 hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
          {vorname ? (
            <UserMenu vorname={vorname} />
          ) : (
            <Link href="/login" className={buttonClasses("primary", "sm", "ml-1")}>
              Login
            </Link>
          )}
          <MobileNav items={items} />
        </nav>
      </div>
    </header>
  );
}
