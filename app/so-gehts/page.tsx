import Link from "next/link";
import { Sparkles } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";
import { buttonClasses } from "@/components/ui/Button";

export const metadata = {
  title: "So funktioniert's – CampusSport Connect",
};

export default function SoGehtsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="headline text-[clamp(2.25rem,6vw,3.5rem)]">
          So funktioniert&apos;s
        </h1>
        <p className="text-muted">
          CampusSport Connect ist für alle gemacht, die neu an der Hochschule
          sind und über den Sport Anschluss finden möchten. In vier Schritten
          bist du dabei – du musst niemanden mitbringen.
        </p>
      </div>

      <HowItWorks />

      <div className="flex items-start gap-3 rounded-card border border-brand/30 bg-brand-soft p-5 text-on-brand-soft">
        <Sparkles size={20} className="mt-0.5 shrink-0" aria-hidden />
        <p>
          Keine Sorge, wenn du niemanden kennst: Bei den meisten Treffen kommen
          die Teilnehmenden allein, und viele Treffen sind ausdrücklich
          anfängerfreundlich.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/registrieren" className={buttonClasses("primary", "md")}>
          Konto erstellen
        </Link>
        <Link href="/treffen" className={buttonClasses("ghost", "md")}>
          Treffen ansehen
        </Link>
      </div>
    </section>
  );
}
