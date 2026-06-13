import Link from "next/link";
import type { MeetingWithStats } from "@/lib/meetings";
import { formatMeetingDate } from "@/lib/format";

export default function MeetingCard({ meeting }: { meeting: MeetingWithStats }) {
  const belegt = meeting.teilnehmer_count;
  const voll = meeting.freie_plaetze === 0;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold leading-tight">{meeting.titel}</h2>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {meeting.sportart}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <dl className="space-y-1 text-sm text-zinc-600">
        <div className="flex gap-2">
          <dt className="text-zinc-400">Wann:</dt>
          <dd>{formatMeetingDate(meeting.datum)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-zinc-400">Wo:</dt>
          <dd>{meeting.ort}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-zinc-400">Plätze:</dt>
          <dd>
            {belegt} von {meeting.max_plaetze} Plätzen belegt
            {voll && (
              <span className="ml-1 font-medium text-red-600">
                (ausgebucht)
              </span>
            )}
          </dd>
        </div>
      </dl>

      {meeting.teilnehmer_count > 0 && (
        <p className="rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
          {meeting.allein_count} von {meeting.teilnehmer_count} kommen allein
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        <Link
          href={`/treffen/${meeting.id}`}
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-center text-sm font-medium hover:border-zinc-500"
        >
          Details ansehen
        </Link>
        <Link
          href={`/treffen/${meeting.id}`}
          aria-disabled={voll}
          className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-white ${
            voll
              ? "pointer-events-none bg-zinc-300"
              : "bg-zinc-900 hover:bg-zinc-700"
          }`}
        >
          {voll ? "Ausgebucht" : "Beitreten"}
        </Link>
      </div>
    </article>
  );
}
