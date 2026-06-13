import Link from "next/link";
import { LogIn } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-sm space-y-6">
      <div className="space-y-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-on-brand-soft">
          <LogIn size={22} aria-hidden />
        </span>
        <div className="space-y-1">
          <h1 className="headline text-[clamp(1.75rem,5vw,2.25rem)]">Willkommen zurück</h1>
          <p className="text-sm text-muted">
            Melde dich an, um Sporttreffen zu finden und mitzumachen.
          </p>
        </div>
      </div>
      <div className="rounded-card border border-line bg-surface p-6 shadow-card">
        <LoginForm />
      </div>
      <p className="text-center text-sm text-muted">
        Noch kein Konto?{" "}
        <Link href="/registrieren" className="font-semibold text-brand-strong hover:underline">
          Jetzt registrieren
        </Link>
      </p>
    </section>
  );
}
