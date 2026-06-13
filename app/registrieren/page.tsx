import Link from "next/link";
import { UserPlus } from "lucide-react";
import RegisterForm from "./RegisterForm";

export default function RegistrierenPage() {
  return (
    <section className="mx-auto max-w-sm space-y-6">
      <div className="space-y-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-on-brand-soft">
          <UserPlus size={22} aria-hidden />
        </span>
        <div className="space-y-1">
          <h1 className="headline text-[clamp(1.75rem,5vw,2.25rem)]">Konto erstellen</h1>
          <p className="text-sm text-muted">
            Erstelle ein Konto und finde Mitspieler an deiner Hochschule.
          </p>
        </div>
      </div>
      <div className="rounded-card border border-line bg-surface p-6 shadow-card">
        <RegisterForm />
      </div>
      <p className="text-center text-sm text-muted">
        Schon ein Konto?{" "}
        <Link href="/login" className="font-semibold text-brand-strong hover:underline">
          Zum Login
        </Link>
      </p>
    </section>
  );
}
