import { createClient } from "@/lib/supabase/server";
import type { ProfileCard } from "@/lib/profiles";

/** Alle Freunde des Nutzers (friendships in beide Richtungen aufgelöst). */
export async function getFriends(userId: string): Promise<ProfileCard[]> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("friendships")
    .select("user_a, user_b")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);

  const friendIds = (rows ?? []).map((r) =>
    r.user_a === userId ? r.user_b : r.user_a
  );
  if (friendIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, studiengang, semester, sportarten, niveau")
    .in("id", friendIds)
    .order("name", { ascending: true });

  return (profiles ?? []).map((p) => ({
    ...p,
    sportarten: p.sportarten ?? [],
  })) as ProfileCard[];
}

/** Prüft, ob zwei Nutzer befreundet sind. */
export async function areFriends(
  userId: string,
  otherId: string
): Promise<boolean> {
  const supabase = await createClient();
  const [a, b] = [userId, otherId].sort();
  const { count } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .eq("user_a", a)
    .eq("user_b", b);
  return (count ?? 0) > 0;
}
