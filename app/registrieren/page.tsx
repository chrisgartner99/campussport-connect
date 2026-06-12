import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function RegistrierenPage() {
  return (
    <section className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrieren
        </h1>
        <p className="text-sm text-zinc-600">
          Erstelle ein Konto und finde Mitspieler an deiner Hochschule.
        </p>
      </div>
      <RegisterForm />
      <p className="text-sm text-zinc-600">
        Schon ein Konto?{" "}
        <Link href="/login" className="font-medium underline">
          Zum Login
        </Link>
      </p>
    </section>
  );
}
