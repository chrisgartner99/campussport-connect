import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";

export const metadata = {
  title: "So funktioniert's – CampusSport Connect",
};

export default function SoGehtsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          So funktioniert&apos;s
        </h1>
        <p className="text-zinc-600">
          CampusSport Connect ist für alle gemacht, die neu an der Hochschule
          sind und über den Sport Anschluss finden möchten. In vier Schritten
          bist du dabei – du musst niemanden mitbringen.
        </p>
      </div>

      <HowItWorks />

      <div className="rounded-lg border border-green-200 bg-green-50 p-5">
        <p className="text-green-900">
          Keine Sorge, wenn du niemanden kennst: Bei den meisten Treffen kommen
          die Teilnehmenden allein, und viele Treffen sind ausdrücklich
          anfängerfreundlich.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/registrieren"
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Konto erstellen
        </Link>
        <Link
          href="/treffen"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:border-zinc-500"
        >
          Treffen ansehen
        </Link>
      </div>
    </section>
  );
}
