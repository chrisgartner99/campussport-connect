import Link from "next/link";
import { CalendarDays, MapPin, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import type { MeetingWithStats } from "@/lib/meetings";
import { formatMeetingDate } from "@/lib/format";
import { SportIcon, sportTone } from "@/lib/sports";
import { meetingLevel } from "@/lib/meetingLevel";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CapacityBar from "@/components/ui/CapacityBar";
import { buttonClasses } from "@/components/ui/Button";

/* ── Hervorgehobenes "Treffen der Woche" (gedrencht, große Kachel) ───────── */
function FeaturedCard({ meeting }: { meeting: MeetingWithStats }) {
  const voll = meeting.freie_plaetze === 0;
  const level = meetingLevel(meeting);
  return (
    <div className="grain relative flex h-full flex-col gap-4 overflow-hidden rounded-card bg-brand-deep p-6 sm:p-8">
      <div className="relative flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-accent">
          <Sparkles size={13} aria-hidden />
          Treffen der Woche
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          <SportIcon sportart={meeting.sportart} size={13} />
          {meeting.sportart}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          <TrendingUp size={13} aria-hidden />
          {level.label}
        </span>
      </div>

      <h2 className="headline relative text-[clamp(1.75rem,4vw,2.75rem)] text-white">
        {meeting.titel}
      </h2>

      <dl className="relative flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-accent" aria-hidden />
          {formatMeetingDate(meeting.datum)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-accent" aria-hidden />
          {meeting.ort}
        </div>
      </dl>

      <div className="relative">
        <CapacityBar belegt={meeting.teilnehmer_count} max={meeting.max_plaetze} tone="dark" />
      </div>

      {meeting.teilnehmer_count > 0 && (
        <p className="relative w-fit rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold text-white">
          {meeting.allein_count} von {meeting.teilnehmer_count} kommen allein
        </p>
      )}

      <div className="relative mt-auto flex flex-wrap gap-2 pt-2">
        <Link
          href={`/treffen/${meeting.id}`}
          aria-disabled={voll}
          className={
            voll
              ? "pointer-events-none rounded-lg bg-white/20 px-5 py-2.5 text-sm font-semibold text-white/70"
              : buttonClasses("accent", "md")
          }
        >
          {voll ? "Ausgebucht" : "Beitreten"}
          {!voll && <ArrowRight size={16} aria-hidden />}
        </Link>
        <Link
          href={`/treffen/${meeting.id}`}
          className="inline-flex items-center rounded-lg border-2 border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/60"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

export default function MeetingCard({
  meeting,
  betoneAllein = false,
  featured = false,
}: {
  meeting: MeetingWithStats;
  betoneAllein?: boolean;
  featured?: boolean;
}) {
  if (featured) return <FeaturedCard meeting={meeting} />;

  const voll = meeting.freie_plaetze === 0;
  const level = meetingLevel(meeting);

  return (
    <Card interactive className="flex h-full flex-col gap-3">
      <div className="flex items-start gap-3">
        {/* Sportart-Farbcodierung */}
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${sportTone(meeting.sportart)}`}
        >
          <SportIcon sportart={meeting.sportart} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold leading-tight">{meeting.titel}</h2>
          <p className="text-sm text-muted">{meeting.sportart}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Klare Einstufung – aus erstie_freundlich + niveau abgeleitet. */}
        <Badge tone={level.tone}>
          {meeting.erstie_freundlich ? <Sparkles size={13} /> : <TrendingUp size={13} />}
          {level.label}
        </Badge>
        {meeting.niveau && (
          <Badge tone="neutral">Niveau: {meeting.niveau}</Badge>
        )}
      </div>

      <dl className="space-y-1.5 text-sm text-muted">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="shrink-0 text-brand-strong" aria-hidden />
          <dt className="sr-only">Wann</dt>
          <dd>{formatMeetingDate(meeting.datum)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-brand-strong" aria-hidden />
          <dt className="sr-only">Wo</dt>
          <dd>{meeting.ort}</dd>
        </div>
      </dl>

      <CapacityBar belegt={meeting.teilnehmer_count} max={meeting.max_plaetze} />

      {meeting.teilnehmer_count > 0 && (
        <p
          className={
            betoneAllein
              ? "rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-on-brand-soft"
              : "rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink"
          }
        >
          {meeting.allein_count} von {meeting.teilnehmer_count} kommen allein
          {betoneAllein && " – du musst niemanden mitbringen"}
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        <Link href={`/treffen/${meeting.id}`} className={buttonClasses("ghost", "sm", "flex-1")}>
          Details
        </Link>
        <Link
          href={`/treffen/${meeting.id}`}
          aria-disabled={voll}
          className={
            voll
              ? "pointer-events-none flex-1 rounded-lg bg-surface-2 px-3 py-2 text-center text-sm font-semibold text-muted"
              : buttonClasses("primary", "sm", "flex-1")
          }
        >
          {voll ? "Ausgebucht" : "Beitreten"}
        </Link>
      </div>
    </Card>
  );
}
