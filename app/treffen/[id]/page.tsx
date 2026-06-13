import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  TrendingUp,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMeetingDetail } from "@/lib/meetings";
import { formatMeetingDate } from "@/lib/format";
import { SportIcon } from "@/lib/sports";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import JoinControls from "./JoinControls";

export default async function TreffenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getMeetingDetail(id);
  if (!detail) {
    notFound();
  }

  const { meeting, participants, allein_count } = detail;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isParticipating = user
    ? participants.some((p) => p.user_id === user.id)
    : false;
  const isFull = participants.length >= meeting.max_plaetze;

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/treffen"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={16} aria-hidden />
        Zurück zur Übersicht
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">
            <SportIcon sportart={meeting.sportart} size={13} />
            {meeting.sportart}
          </Badge>
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
        <h1 className="headline text-[clamp(2.25rem,6vw,3.5rem)]">{meeting.titel}</h1>
      </header>

      <Card className="grid gap-4 text-sm sm:grid-cols-3">
        <div className="flex items-start gap-2">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-brand-strong" aria-hidden />
          <div>
            <dt className="text-muted">Wann</dt>
            <dd className="font-semibold">{formatMeetingDate(meeting.datum)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={18} className="mt-0.5 shrink-0 text-brand-strong" aria-hidden />
          <div>
            <dt className="text-muted">Wo</dt>
            <dd className="font-semibold">{meeting.ort}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users size={18} className="mt-0.5 shrink-0 text-brand-strong" aria-hidden />
          <div>
            <dt className="text-muted">Plätze</dt>
            <dd className="font-semibold">
              {participants.length} von {meeting.max_plaetze} belegt
            </dd>
          </div>
        </div>
      </Card>

      {meeting.beschreibung && (
        <p className="text-ink/90">{meeting.beschreibung}</p>
      )}

      {meeting.ablauf && (
        <section className="rounded-card border border-brand/25 bg-brand-soft p-5">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-on-brand-soft">
            <ClipboardList size={18} aria-hidden />
            Was erwartet dich
          </h2>
          <p className="whitespace-pre-line text-on-brand-soft/90">{meeting.ablauf}</p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Teilnehmer ({participants.length})</h2>
        {participants.length > 0 && (
          <p className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm font-semibold text-ink">
            <Users size={15} className="text-brand-strong" aria-hidden />
            {allein_count} von {participants.length} Teilnehmern kommen allein
          </p>
        )}
        {participants.length === 0 ? (
          <p className="text-sm text-muted">Noch niemand dabei – sei die erste Person!</p>
        ) : (
          <ul className="divide-y divide-line rounded-card border border-line bg-surface">
            {participants.map((p) => (
              <li key={p.user_id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={p.name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.semester ? `${p.semester}. Semester` : "—"}
                    {p.kommt_allein && " · kommt allein"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-line pt-5">
        <JoinControls
          meetingId={meeting.id}
          isLoggedIn={!!user}
          isParticipating={isParticipating}
          isFull={isFull}
        />
      </div>
    </section>
  );
}
