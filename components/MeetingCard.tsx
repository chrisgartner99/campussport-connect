import Link from "next/link";
import { CalendarDays, MapPin, Users, Sparkles, TrendingUp } from "lucide-react";
import type { MeetingWithStats } from "@/lib/meetings";
import { formatMeetingDate } from "@/lib/format";
import { SportIcon } from "@/lib/sports";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";

export default function MeetingCard({
  meeting,
  betoneAllein = false,
}: {
  meeting: MeetingWithStats;
  /** Hebt die "kommen allein"-Zeile hervor (Erstie-Fokus). */
  betoneAllein?: boolean;
}) {
  const belegt = meeting.teilnehmer_count;
  const voll = meeting.freie_plaetze === 0;

  return (
    <Card interactive className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold leading-tight">{meeting.titel}</h2>
        <Badge tone="neutral" className="shrink-0">
          <SportIcon sportart={meeting.sportart} size={13} />
          {meeting.sportart}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {meeting.erstie_freundlich && (
          <Badge tone="success">
            <Sparkles size={13} />
            Anfängerfreundlich
          </Badge>
        )}
        {meeting.niveau && (
          <Badge tone="neutral">
            <TrendingUp size={13} />
            {meeting.niveau}
          </Badge>
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
        <div className="flex items-center gap-2">
          <Users size={15} className="shrink-0 text-brand-strong" aria-hidden />
          <dt className="sr-only">Plätze</dt>
          <dd>
            {belegt} von {meeting.max_plaetze} Plätzen belegt
            {voll && <span className="ml-1 font-semibold text-danger">(ausgebucht)</span>}
          </dd>
        </div>
      </dl>

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
          Details ansehen
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
