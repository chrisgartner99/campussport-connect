import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  Inbox,
  ArrowRight,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatMeetingDate } from "@/lib/format";
import { SportIcon } from "@/lib/sports";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import RequestActions from "./RequestActions";

type MeetingRow = {
  id: string;
  titel: string;
  sportart: string;
  datum: string;
  ort: string;
};

const STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  offen: { label: "offen", tone: "warning" },
  angenommen: { label: "angenommen", tone: "success" },
  abgelehnt: { label: "abgelehnt", tone: "danger" },
};

/** Eine kompakte Treffen-Zeile mit Link zur Detailseite. */
function MeetingRowItem({ meeting }: { meeting: MeetingRow }) {
  return (
    <li>
      <Link
        href={`/treffen/${meeting.id}`}
        className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3 shadow-card transition-colors hover:border-brand/50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-on-brand-soft">
          <SportIcon sportart={meeting.sportart} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-ink">{meeting.titel}</span>
          <span className="block truncate text-sm text-muted">
            {meeting.sportart} · {meeting.ort}
          </span>
        </span>
        <span className="hidden shrink-0 text-sm text-muted sm:block">
          {formatMeetingDate(meeting.datum)}
        </span>
        <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden />
      </Link>
    </li>
  );
}

function relName(rel: unknown): string {
  const obj = Array.isArray(rel) ? rel[0] : rel;
  return (obj as { name?: string } | null)?.name ?? "Unbekannt";
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof CalendarDays;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold">
      <Icon size={18} className="text-brand-strong" aria-hidden />
      {children}
    </h2>
  );
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

  const { data: teilnahmen } = await supabase
    .from("participations")
    .select("meetings (id, titel, sportart, datum, ort)")
    .eq("user_id", user.id);
  const kommende: MeetingRow[] = (teilnahmen ?? [])
    .map((t) => (Array.isArray(t.meetings) ? t.meetings[0] : t.meetings))
    .filter((m): m is MeetingRow => !!m && m.datum >= nowIso)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  const { data: erstellt } = await supabase
    .from("meetings")
    .select("id, titel, sportart, datum, ort")
    .eq("creator_id", user.id)
    .order("datum", { ascending: true });

  const { data: erhalten } = await supabase
    .from("requests")
    .select("id, nachricht, created_at, sender:profiles!sender_id (name)")
    .eq("empfaenger_id", user.id)
    .eq("status", "offen")
    .order("created_at", { ascending: false });

  const { data: gesendet } = await supabase
    .from("requests")
    .select("id, nachricht, status, empfaenger:profiles!empfaenger_id (name)")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Meine Treffen</h1>
        <p className="text-muted">
          Deine Teilnahmen, eigenen Treffen und Anfragen auf einen Blick.
        </p>
      </div>

      <div className="space-y-3">
        <SectionTitle icon={CalendarDays}>Kommende Treffen</SectionTitle>
        {kommende.length === 0 ? (
          <p className="text-sm text-muted">
            Du bist aktuell bei keinem kommenden Treffen dabei.{" "}
            <Link href="/treffen" className="font-semibold text-brand-strong hover:underline">
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
        <SectionTitle icon={ClipboardList}>Von mir erstellt</SectionTitle>
        {(erstellt ?? []).length === 0 ? (
          <p className="text-sm text-muted">
            Du hast noch kein Treffen erstellt.{" "}
            <Link href="/treffen/neu" className="font-semibold text-brand-strong hover:underline">
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

      <div className="space-y-4">
        <SectionTitle icon={Inbox}>Anfragen</SectionTitle>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted">Erhalten</h3>
          {(erhalten ?? []).length === 0 ? (
            <p className="text-sm text-muted">Keine offenen Anfragen.</p>
          ) : (
            <ul className="space-y-2">
              {(erhalten ?? []).map((r) => (
                <li
                  key={r.id}
                  className="space-y-3 rounded-card border border-line bg-surface p-4 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={relName(r.sender)} size="sm" />
                    <p className="text-sm">
                      <span className="font-semibold text-ink">{relName(r.sender)}</span>{" "}
                      <span className="text-muted">möchte sich mit dir vernetzen.</span>
                    </p>
                  </div>
                  {r.nachricht && (
                    <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink">
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
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-muted">
            <Send size={14} aria-hidden />
            Gesendet
          </h3>
          {(gesendet ?? []).length === 0 ? (
            <p className="text-sm text-muted">Du hast noch keine Anfragen gesendet.</p>
          ) : (
            <ul className="space-y-2">
              {(gesendet ?? []).map((r) => {
                const s = STATUS[r.status] ?? { label: r.status, tone: "neutral" as BadgeTone };
                return (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3 text-sm shadow-card"
                  >
                    <span className="flex items-center gap-2">
                      <Avatar name={relName(r.empfaenger)} size="sm" />
                      <span>
                        Anfrage an{" "}
                        <span className="font-semibold text-ink">{relName(r.empfaenger)}</span>
                      </span>
                    </span>
                    <Badge tone={s.tone}>{s.label}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
