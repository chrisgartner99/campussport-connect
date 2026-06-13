import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import Avatar from "@/components/ui/Avatar";

/**
 * Kleines Aufklapp-Menü für eingeloggte Nutzer.
 * Bewusst ohne Client-JavaScript über <details>/<summary> gelöst.
 */
export default function UserMenu({ vorname }: { vorname: string }) {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line px-2 py-1 text-sm font-medium text-ink transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
        <Avatar name={vorname} size="sm" />
        <span className="hidden sm:inline">{vorname}</span>
        <span aria-hidden className="text-muted">▾</span>
      </summary>
      <div className="absolute right-0 z-40 mt-2 w-44 rounded-card border border-line bg-surface py-1 text-sm shadow-pop">
        <Link
          href="/profil"
          className="block px-3 py-2 text-ink hover:bg-surface-2"
        >
          Mein Profil
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="block w-full px-3 py-2 text-left text-ink hover:bg-surface-2"
          >
            Abmelden
          </button>
        </form>
      </div>
    </details>
  );
}
