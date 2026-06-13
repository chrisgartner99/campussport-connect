import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMeetingDetail } from "@/lib/meetings";
import { formatMeetingDate } from "@/lib/format";
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
      <Link href="/treffen" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Zurück zur Übersicht
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            {meeting.sportart}
          </span>
          {meeting.erstie_freundlich && (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
              Anfängerfreundlich
            </span>
          )}
          {meeting.niveau && (
            <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600">
              Niveau: {meeting.niveau}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {meeting.titel}
        </h1>
      </header>

      <dl className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-400">Wann</dt>
          <dd className="font-medium">{formatMeetingDate(meeting.datum)}</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Wo</dt>
          <dd className="font-medium">{meeting.ort}</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Plätze</dt>
          <dd className="font-medium">
            {participants.length} von {meeting.max_plaetze} belegt
          </dd>
        </div>
      </dl>

      {meeting.beschreibung && (
        <p className="text-zinc-700">{meeting.beschreibung}</p>
      )}

      {meeting.ablauf && (
        <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="mb-2 text-lg font-semibold">Was erwartet dich</h2>
          <p className="whitespace-pre-line text-zinc-700">{meeting.ablauf}</p>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Teilnehmer ({participants.length})
          </h2>
        </div>
        {participants.length > 0 && (
          <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800">
            {allein_count} von {participants.length} Teilnehmern kommen allein
          </p>
        )}
        {participants.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Noch niemand dabei — sei die erste Person!
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
            {participants.map((p) => (
              <li
                key={p.user_id}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-zinc-500">
                  {p.semester ? `${p.semester}. Semester` : "—"}
                  {p.kommt_allein && (
                    <span className="ml-2 text-zinc-400">· kommt allein</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-zinc-200 pt-5">
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
