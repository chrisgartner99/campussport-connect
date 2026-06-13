import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatMeetingDate } from "@/lib/format";
import RequestActions from "./RequestActions";

type MeetingRow = {
  id: string;
  titel: string;
  sportart: string;
  datum: string;
  ort: string;
};

const STATUS_LABEL: Record<string, string> = {
  offen: "offen",
  angenommen: "angenommen",
  abgelehnt: "abgelehnt",
};

/** Eine kompakte Treffen-Zeile mit Link zur Detailseite. */
function MeetingRowItem({ meeting }: { meeting: MeetingRow }) {
  return (
    <li>
      <Link
        href={`/treffen/${meeting.id}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-400"
      >
        <span>
          <span className="font-medium">{meeting.titel}</span>
          <span className="block text-sm text-zinc-500">
            {meeting.sportart} · {meeting.ort}
          </span>
        </span>
        <span className="shrink-0 text-sm text-zinc-500">
          {formatMeetingDate(meeting.datum)}
        </span>
      </Link>
    </li>
  );
}

function relName(rel: unknown): string {
  const obj = Array.isArray(rel) ? rel[0] : rel;
  return (obj as { name?: string } | null)?.name ?? "Unbekannt";
}

export default async function MeineTreffenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const nowIso = new Date().toISOString();

  // Kommende Treffen, bei denen ich teilnehme.
  const { data: teilnahmen } = await supabase
    .from("participations")
    .select("meetings (id, titel, sportart, datum, ort)")
    .eq("user_id", user.id);
  const kommende: MeetingRow[] = (teilnahmen ?? [])
    .map((t) => (Array.isArray(t.meetings) ? t.meetings[0] : t.meetings))
    .filter((m): m is MeetingRow => !!m && m.datum >= nowIso)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  // Von mir erstellte Treffen.
  const { data: erstellt } = await supabase
    .from("meetings")
    .select("id, titel, sportart, datum, ort")
    .eq("creator_id", user.id)
    .order("datum", { ascending: true });

  // Erhaltene offene Anfragen.
  const { data: erhalten } = await supabase
    .from("requests")
    .select("id, nachricht, created_at, sender:profiles!sender_id (name)")
    .eq("empfaenger_id", user.id)
    .eq("status", "offen")
    .order("created_at", { ascending: false });

  // Gesendete Anfragen mit Status.
  const { data: gesendet } = await supabase
    .from("requests")
    .select("id, nachricht, status, empfaenger:profiles!empfaenger_id (name)")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Meine Treffen</h1>
        <p className="text-zinc-600">
          Deine Teilnahmen, eigenen Treffen und Anfragen auf einen Blick.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Kommende Treffen</h2>
        {kommende.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Du bist aktuell bei keinem kommenden Treffen dabei.{" "}
            <Link href="/treffen" className="underline">
              Treffen entdecken
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {kommende.map((m) => (
              <MeetingRowItem key={m.id} meeting={m} />
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Von mir erstellt</h2>
        {(erstellt ?? []).length === 0 ? (
          <p className="text-sm text-zinc-500">
            Du hast noch kein Treffen erstellt.{" "}
            <Link href="/treffen/neu" className="underline">
              Jetzt eines anlegen
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {(erstellt as MeetingRow[]).map((m) => (
              <MeetingRowItem key={m.id} meeting={m} />
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Anfragen</h2>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-500">Erhalten</h3>
          {(erhalten ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">Keine offenen Anfragen.</p>
          ) : (
            <ul className="space-y-2">
              {(erhalten ?? []).map((r) => (
                <li
                  key={r.id}
                  className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4"
                >
                  <p className="text-sm">
                    <span className="font-medium">{relName(r.sender)}</span>{" "}
                    möchte sich mit dir vernetzen.
                  </p>
                  {r.nachricht && (
                    <p className="rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                      „{r.nachricht}&ldquo;
                    </p>
                  )}
                  <RequestActions requestId={r.id} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-500">Gesendet</h3>
          {(gesendet ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">
              Du hast noch keine Anfragen gesendet.
            </p>
          ) : (
            <ul className="space-y-2">
              {(gesendet ?? []).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm"
                >
                  <span>
                    Anfrage an{" "}
                    <span className="font-medium">{relName(r.empfaenger)}</span>
                  </span>
                  <span className="shrink-0 text-zinc-500">
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
