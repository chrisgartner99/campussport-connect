import Link from "next/link";
import { logout } from "@/lib/actions/auth";

/**
 * Kleines Aufklapp-Menü für eingeloggte Nutzer.
 * Bewusst ohne Client-JavaScript über <details>/<summary> gelöst.
 */
export default function UserMenu({ vorname }: { vorname: string }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer select-none list-none rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:border-zinc-500 [&::-webkit-details-marker]:hidden">
        {vorname} <span aria-hidden>▾</span>
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-zinc-200 bg-white py-1 text-sm shadow-md">
        <Link href="/profil" className="block px-3 py-1.5 hover:bg-zinc-50">
          Mein Profil
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="block w-full px-3 py-1.5 text-left hover:bg-zinc-50"
          >
            Abmelden
          </button>
        </form>
      </div>
    </details>
  );
}
