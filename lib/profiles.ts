import { createClient } from "@/lib/supabase/server";

export type ProfileCard = {
  id: string;
  name: string;
  studiengang: string | null;
  semester: number | null;
  sportarten: string[];
  niveau: string | null;
};

/** Alle Profile außer dem eigenen, alphabetisch nach Name. */
export async function getOtherProfiles(
  ownId: string
): Promise<ProfileCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name, studiengang, semester, sportarten, niveau")
    .neq("id", ownId)
    .order("name", { ascending: true });

  return (data ?? []).map((p) => ({
    ...p,
    sportarten: p.sportarten ?? [],
  })) as ProfileCard[];
}

/** Empfänger-IDs, an die der Nutzer bereits eine offene Anfrage hat. */
export async function getOpenRequestTargets(
  ownId: string
): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("requests")
    .select("empfaenger_id")
    .eq("sender_id", ownId)
    .eq("status", "offen");

  return new Set((data ?? []).map((r) => r.empfaenger_id));
}
