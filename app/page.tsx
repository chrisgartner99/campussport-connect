import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";

const FEATURES = [
  {
    titel: "Passende Mitspieler finden",
    text: "Entdecke Studierende mit den gleichen Sportarten und einem ähnlichen Niveau wie du.",
  },
  {
    titel: "Sporttreffen einfach organisieren",
    text: "Erstelle in wenigen Schritten ein Treffen oder tritt einem bestehenden bei.",
  },
  {
    titel: "Neue Kontakte auf dem Campus knüpfen",
    text: "Lerne über den Sport ganz nebenbei neue Leute an deiner Hochschule kennen.",
  },
];

const ERSTI_PUNKTE = [
  {
    titel: "Du musst niemanden kennen",
    text: "Komm einfach vorbei – hier ist niemand mit einer festen Clique unterwegs.",
  },
  {
    titel: "Viele kommen allein",
    text: "Bei den meisten Treffen siehst du direkt, wie viele allein kommen. Du bist nicht die Ausnahme.",
  },
  {
    titel: "Alles anfängerfreundlich",
    text: "Zahlreiche Treffen sind ausdrücklich für Einsteiger – Können ist keine Voraussetzung.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6 py-8 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight">
          Finde Leute für gemeinsamen Sport — auch wenn du noch niemanden
          kennst.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-600">
          Gerade frisch an der Hochschule Heilbronn? CampusSport Connect bringt
          dich mit anderen Studierenden zusammen – ganz ohne Vorkenntnisse und
          ohne Freundeskreis vor Ort.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/treffen"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Sporttreffen entdecken
          </Link>
          <Link
            href="/so-gehts"
            className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:border-zinc-500"
          >
            Neu hier? So funktioniert&apos;s
          </Link>
        </div>
      </section>

      {/* Feature-Karten */}
      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.titel}
            className="space-y-2 rounded-lg border border-zinc-200 bg-white p-5"
          >
            <h2 className="font-semibold">{feature.titel}</h2>
            <p className="text-sm text-zinc-600">{feature.text}</p>
          </div>
        ))}
      </section>

      {/* Speziell für Erstsemester */}
      <section className="space-y-5 rounded-xl border border-green-200 bg-green-50 p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Speziell für Erstsemester
          </h2>
          <p className="text-zinc-700">
            Der Start an einer neuen Hochschule ist aufregend genug. Sport
            verbindet – und bei uns ist der Einstieg leicht.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {ERSTI_PUNKTE.map((punkt) => (
            <div key={punkt.titel} className="space-y-1">
              <h3 className="font-semibold text-green-900">{punkt.titel}</h3>
              <p className="text-sm text-green-900/80">{punkt.text}</p>
            </div>
          ))}
        </div>
        <Link
          href="/registrieren"
          className="inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Jetzt loslegen
        </Link>
      </section>

      {/* So funktioniert's */}
      <section id="so-gehts" className="space-y-5 scroll-mt-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            So funktioniert&apos;s
          </h2>
          <p className="text-zinc-600">
            In vier Schritten vom Konto zum ersten gemeinsamen Training.
          </p>
        </div>
        <HowItWorks />
      </section>
    </div>
  );
}
