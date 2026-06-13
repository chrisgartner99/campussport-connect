import { createClient } from "@/lib/supabase/server";

export type Meeting = {
  id: string;
  creator_id: string;
  titel: string;
  sportart: string;
  beschreibung: string | null;
  ablauf: string | null;
  datum: string;
  ort: string;
  niveau: string | null;
  max_plaetze: number;
  erstie_freundlich: boolean;
};

/** Treffen mit aufbereiteten Teilnahme-Zahlen für die Übersicht. */
export type MeetingWithStats = Meeting & {
  teilnehmer_count: number;
  allein_count: number;
  freie_plaetze: number;
};

type ParticipationCount = {
  meeting_id: string;
  teilnehmer: number;
  allein: number;
};

/** Zählt Teilnehmer und "kommt allein" je Treffen. */
async function loadParticipationCounts(
  meetingIds: string[]
): Promise<Map<string, ParticipationCount>> {
  const counts = new Map<string, ParticipationCount>();
  if (meetingIds.length === 0) return counts;

  const supabase = await createClient();
  const { data } = await supabase
    .from("participations")
    .select("meeting_id, kommt_allein")
    .in("meeting_id", meetingIds);

  for (const row of data ?? []) {
    const entry = counts.get(row.meeting_id) ?? {
      meeting_id: row.meeting_id,
      teilnehmer: 0,
      allein: 0,
    };
    entry.teilnehmer += 1;
    if (row.kommt_allein) entry.allein += 1;
    counts.set(row.meeting_id, entry);
  }
  return counts;
}

/** Alle zukünftigen Treffen, nach Datum aufsteigend, inkl. Teilnahme-Zahlen. */
export async function getUpcomingMeetings(): Promise<MeetingWithStats[]> {
  const supabase = await createClient();
  const { data: meetings } = await supabase
    .from("meetings")
    .select(
      "id, creator_id, titel, sportart, beschreibung, ablauf, datum, ort, niveau, max_plaetze, erstie_freundlich"
    )
    .gte("datum", new Date().toISOString())
    .order("datum", { ascending: true });

  const list = (meetings ?? []) as Meeting[];
  const counts = await loadParticipationCounts(list.map((m) => m.id));

  return list.map((m) => {
    const c = counts.get(m.id);
    const teilnehmer = c?.teilnehmer ?? 0;
    return {
      ...m,
      teilnehmer_count: teilnehmer,
      allein_count: c?.allein ?? 0,
      freie_plaetze: Math.max(0, m.max_plaetze - teilnehmer),
    };
  });
}

export type Participant = {
  user_id: string;
  kommt_allein: boolean;
  name: string;
  semester: number | null;
};

export type MeetingDetail = {
  meeting: Meeting;
  participants: Participant[];
  allein_count: number;
};

/** Ein Treffen samt Teilnehmerliste (Name + Semester). */
export async function getMeetingDetail(
  id: string
): Promise<MeetingDetail | null> {
  const supabase = await createClient();
  const { data: meeting } = await supabase
    .from("meetings")
    .select(
      "id, creator_id, titel, sportart, beschreibung, ablauf, datum, ort, niveau, max_plaetze, erstie_freundlich"
    )
    .eq("id", id)
    .maybeSingle();

  if (!meeting) return null;

  const { data: rows } = await supabase
    .from("participations")
    .select("user_id, kommt_allein, profiles (name, semester)")
    .eq("meeting_id", id)
    .order("created_at", { ascending: true });

  const participants: Participant[] = (rows ?? []).map((row) => {
    // Supabase liefert die verknüpfte Relation je nach Typisierung als
    // Objekt oder Array – beide Fälle abdecken.
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    return {
      user_id: row.user_id,
      kommt_allein: row.kommt_allein,
      name: profile?.name ?? "Unbekannt",
      semester: profile?.semester ?? null,
    };
  });

  return {
    meeting: meeting as Meeting,
    participants,
    allein_count: participants.filter((p) => p.kommt_allein).length,
  };
}
