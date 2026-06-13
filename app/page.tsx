import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Goal, Dumbbell, Volleyball, Footprints, Mountain, Waves } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";
import { buttonClasses } from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const ERSTI_PUNKTE = [
  {
    nr: "01",
    titel: "Du musst niemanden kennen",
    text: "Komm einfach vorbei – hier ist niemand mit einer festen Clique unterwegs.",
  },
  {
    nr: "02",
    titel: "Viele kommen allein",
    text: "Bei den meisten Treffen siehst du direkt, wie viele allein kommen. Du bist nicht die Ausnahme.",
  },
  {
    nr: "03",
    titel: "Alles anfängerfreundlich",
    text: "Zahlreiche Treffen sind ausdrücklich für Einsteiger. Können ist keine Voraussetzung.",
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-8">
      {/* ───────────────────────── HERO (asymmetrisch) ───────────────────────── */}
      <section className="grid items-center gap-10 pt-4 lg:grid-cols-12 lg:gap-8">
        <StaggerGroup className="lg:col-span-7">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-accent">
              <Sparkles size={14} aria-hidden />
              Hochschule Heilbronn
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="headline mt-5 text-[clamp(2.9rem,8.5vw,6rem)]">
              Finde deinen{" "}
              <span className="text-brand-strong">Sport.</span>
              <br />
              Und deine{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Leute.</span>
                <span
                  aria-hidden
                  className="absolute inset-x-[-0.1em] bottom-[0.08em] z-0 h-[0.34em] -rotate-1 bg-accent"
                />
              </span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-md text-lg text-muted">
              Gerade frisch am Campus? CampusSport Connect bringt dich über
              gemeinsamen Sport mit anderen Studierenden zusammen. Ohne
              Vorkenntnisse, ohne Freundeskreis vor Ort.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/treffen" className={buttonClasses("accent", "lg")}>
                Sporttreffen entdecken
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/so-gehts" className={buttonClasses("ghost", "lg")}>
                So funktioniert&apos;s
              </Link>
            </div>
          </StaggerItem>
        </StaggerGroup>

        {/* Farbblock rechts mit Sport-Icon-Collage */}
        <Reveal delay={0.15} className="lg:col-span-5">
          <div className="grain relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-deep sm:aspect-[5/4] lg:aspect-[4/5]">
            <span className="headline pointer-events-none absolute -right-2 top-3 select-none text-[7rem] leading-none text-white/10">
              MOVE
            </span>
            <div className="absolute inset-0 grid grid-cols-2 place-items-center gap-2 p-6">
              <Goal size={64} className="-rotate-12 text-white/90" aria-hidden />
              <Dumbbell size={64} className="rotate-6 text-accent" aria-hidden />
              <Volleyball size={64} className="rotate-3 text-white/90" aria-hidden />
              <Footprints size={64} className="-rotate-6 text-white/90" aria-hidden />
              <Waves size={56} className="rotate-6 text-white/80" aria-hidden />
              <Mountain size={56} className="-rotate-3 text-accent" aria-hidden />
            </div>
            <div className="absolute inset-x-5 bottom-5 rounded-xl bg-black/25 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">
                10 Sportarten · neue Treffen jede Woche
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────────────── Warum (versetzt, Jersey-Nummern) ───────────────── */}
      <section className="space-y-10">
        <Reveal>
          <h2 className="headline text-[clamp(1.9rem,5vw,3.25rem)]">
            Sport verbindet.
            <br className="hidden sm:block" /> Wir machen den Anfang leicht.
          </h2>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
          {[
            { titel: "Passende Mitspieler finden", text: "Studierende mit deinen Sportarten und deinem Niveau – gefiltert, nicht zufällig." },
            { titel: "Treffen organisieren", text: "In wenigen Schritten ein Treffen anlegen oder einem bestehenden beitreten." },
            { titel: "Kontakte am Campus knüpfen", text: "Über den Sport ganz nebenbei neue Leute an deiner Hochschule kennenlernen." },
          ].map((f, i) => (
            <Reveal key={f.titel} delay={i * 0.08}>
              <div className="h-full bg-surface p-6">
                <span className="headline block text-3xl text-brand-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-extrabold">{f.titel}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── Speziell für Erstsemester (Drench) ─────────────────── */}
      <Reveal>
        <section className="grain relative overflow-hidden rounded-[2rem] bg-brand-deep px-6 py-12 sm:px-10 sm:py-14">
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-accent">
              Für Erstsemester
            </span>
            <h2 className="headline mt-5 text-[clamp(2rem,5.5vw,3.5rem)] text-white">
              Niemand hier kennt schon alle.
            </h2>
          </div>
          <div className="relative mt-10 grid gap-8 sm:grid-cols-3">
            {ERSTI_PUNKTE.map((p) => (
              <div key={p.nr} className="space-y-2">
                <span className="headline block text-5xl text-accent">{p.nr}</span>
                <h3 className="text-lg font-extrabold text-white">{p.titel}</h3>
                <p className="text-sm text-white/80">{p.text}</p>
              </div>
            ))}
          </div>
          <Link
            href="/registrieren"
            className={buttonClasses("accent", "lg", "relative mt-10")}
          >
            Jetzt loslegen
            <ArrowRight size={18} aria-hidden />
          </Link>
        </section>
      </Reveal>

      {/* ───────────────────────── So funktioniert's ─────────────────────────── */}
      <Reveal>
        <section id="so-gehts" className="scroll-mt-24 space-y-8">
          <h2 className="headline text-[clamp(1.9rem,5vw,3.25rem)]">
            In vier Schritten dabei
          </h2>
          <HowItWorks />
        </section>
      </Reveal>
    </div>
  );
}
