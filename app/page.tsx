import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";

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
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface px-6 py-16 text-center shadow-card sm:px-10">
        {/* Markenfarbener Verlaufs-Schimmer im Hintergrund */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--brand) 22%, transparent), transparent 70%), radial-gradient(50% 50% at 85% 30%, color-mix(in oklab, var(--blue) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl space-y-6">
          <Badge tone="brand">Für Studierende der Hochschule Heilbronn</Badge>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            Finde Leute für gemeinsamen Sport — auch wenn du noch niemanden
            kennst.
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Gerade frisch am Campus? CampusSport Connect bringt dich mit anderen
            Studierenden zusammen – ohne Vorkenntnisse und ohne Freundeskreis vor
            Ort.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/treffen" className={buttonClasses("primary", "lg")}>
              Sporttreffen entdecken
            </Link>
            <Link href="/so-gehts" className={buttonClasses("ghost", "lg")}>
              Neu hier? So funktioniert&apos;s
            </Link>
          </div>
        </div>
      </section>

      {/* Feature-Karten */}
      <section className="grid gap-5 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.titel} className="space-y-2">
            <h2 className="text-lg font-bold">{feature.titel}</h2>
            <p className="text-sm text-muted">{feature.text}</p>
          </Card>
        ))}
      </section>

      {/* Speziell für Erstsemester */}
      <section className="overflow-hidden rounded-[1.75rem] border border-brand/30 bg-brand-soft p-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-brand-soft">
            Speziell für Erstsemester
          </h2>
          <p className="text-on-brand-soft/90">
            Der Start an einer neuen Hochschule ist aufregend genug. Sport
            verbindet – und bei uns ist der Einstieg leicht.
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {ERSTI_PUNKTE.map((punkt) => (
            <div key={punkt.titel} className="space-y-1">
              <h3 className="font-bold text-on-brand-soft">{punkt.titel}</h3>
              <p className="text-sm text-on-brand-soft/85">{punkt.text}</p>
            </div>
          ))}
        </div>
        <Link
          href="/registrieren"
          className={buttonClasses("primary", "md", "mt-7")}
        >
          Jetzt loslegen
        </Link>
      </section>

      {/* So funktioniert's */}
      <section id="so-gehts" className="scroll-mt-20 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight">
            So funktioniert&apos;s
          </h2>
          <p className="text-muted">
            In vier Schritten vom Konto zum ersten gemeinsamen Training.
          </p>
        </div>
        <HowItWorks />
      </section>
    </div>
  );
}
