"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type JoinState = { error: string } | null;

/**
 * Tritt einem Treffen bei. Prüft Login (sonst Umleitung zu /login)
 * und ob noch Plätze frei sind, und legt dann eine participation an.
 */
export async function joinMeeting(
  meetingId: string,
  kommtAllein: boolean
): Promise<JoinState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Kapazität prüfen: max_plaetze gegen aktuelle Teilnehmerzahl.
  const { data: meeting } = await supabase
    .from("meetings")
    .select("max_plaetze")
    .eq("id", meetingId)
    .maybeSingle();
  if (!meeting) {
    return { error: "Dieses Treffen existiert nicht mehr." };
  }

  const { count } = await supabase
    .from("participations")
    .select("*", { count: "exact", head: true })
    .eq("meeting_id", meetingId);

  if ((count ?? 0) >= meeting.max_plaetze) {
    return { error: "Treffen ist ausgebucht." };
  }

  const { error } = await supabase.from("participations").upsert(
    {
      meeting_id: meetingId,
      user_id: user.id,
      kommt_allein: kommtAllein,
    },
    { onConflict: "meeting_id,user_id" }
  );
  if (error) {
    return { error: "Beitreten fehlgeschlagen. Bitte versuche es erneut." };
  }

  revalidatePath("/treffen");
  revalidatePath(`/treffen/${meetingId}`);
  return null;
}

/** Entfernt die eigene Teilnahme an einem Treffen. */
export async function leaveMeeting(meetingId: string): Promise<JoinState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("participations")
    .delete()
    .eq("meeting_id", meetingId)
    .eq("user_id", user.id);
  if (error) {
    return { error: "Absagen fehlgeschlagen. Bitte versuche es erneut." };
  }

  revalidatePath("/treffen");
  revalidatePath(`/treffen/${meetingId}`);
  return null;
}
