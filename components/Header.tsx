import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getNotificationCounts } from "@/lib/notifications";
import UserMenu from "@/components/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import NotificationBell from "@/components/NotificationBell";
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
  let counts = { requests: 0, messages: 0, total: 0 };
  if (user) {
    const [{ data: profile }, notif] = await Promise.all([
      supabase.from("profiles").select("name").eq("id", user.id).maybeSingle(),
      getNotificationCounts(user.id),
    ]);
    const name =
      profile?.name ??
      user.user_metadata?.name?.toString() ??
      user.email ??
      "Profil";
    vorname = name.split(" ")[0];
    counts = notif;
  }

  const items = [...publicNav, ...(vorname ? authNav : [])];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-strong text-on-brand"
          >
            {/* Stilisierter Aktivitäts-/Puls-Marker als Logo */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l2 6 4-14 2 8h6" />
            </svg>
          </span>
          <span className="headline text-xl leading-none">
            CampusSport<span className="text-brand-strong">.</span>
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
          {vorname && <NotificationBell counts={counts} />}
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
