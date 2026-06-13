import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "@/components/UserMenu";

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

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          CampusSport Connect
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {[...publicNav, ...(vorname ? authNav : [])].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-zinc-600 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
          {vorname ? (
            <UserMenu vorname={vorname} />
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
