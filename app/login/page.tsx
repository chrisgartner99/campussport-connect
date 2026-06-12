import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-zinc-600">
          Melde dich an, um Sporttreffen zu finden und mitzumachen.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-zinc-600">
        Noch kein Konto?{" "}
        <Link href="/registrieren" className="font-medium underline">
          Jetzt registrieren
        </Link>
      </p>
    </section>
  );
}
