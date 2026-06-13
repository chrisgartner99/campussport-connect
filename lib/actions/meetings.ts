"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";

export type JoinState = { error: string } | null;

export type CreateMeetingState = { error: string } | null;

/**
 * Legt ein neues Sporttreffen an (nur eingeloggte Nutzer), trägt den
 * Ersteller direkt als Teilnehmer ein und leitet auf die Detailseite
 * des neuen Treffens weiter.
 */
export async function createMeeting(
  _prevState: CreateMeetingState,
  formData: FormData
): Promise<CreateMeetingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const titel = formData.get("titel")?.toString().trim() ?? "";
  const sportart = formData.get("sportart")?.toString() ?? "";
  const datum = formData.get("datum")?.toString() ?? "";
  const uhrzeit = formData.get("uhrzeit")?.toString() ?? "";
  const ort = formData.get("ort")?.toString().trim() ?? "";
  const niveau = formData.get("niveau")?.toString() ?? "";
  const maxPlaetze = Number.parseInt(
    formData.get("max_plaetze")?.toString() ?? "",
    10
  );
  const beschreibung = formData.get("beschreibung")?.toString().trim() ?? "";
  const ablauf = formData.get("ablauf")?.toString().trim() ?? "";
  const erstieFreundlich = formData.get("erstie_freundlich") === "on";

  if (!titel) return { error: "Bitte gib einen Titel an." };
  if (!(SPORTARTEN as readonly string[]).includes(sportart)) {
    return { error: "Bitte wähle eine Sportart aus." };
  }
  if (!datum || !uhrzeit) {
    return { error: "Bitte gib Datum und Uhrzeit an." };
  }
  const datumIso = new Date(`${datum}T${uhrzeit}`);
  if (Number.isNaN(datumIso.getTime())) {
    return { error: "Datum oder Uhrzeit ist ungültig." };
  }
  if (!ort) return { error: "Bitte gib einen Ort an." };
  if (!(NIVEAUS as readonly string[]).includes(niveau)) {
    return { error: "Bitte wähle ein Niveau aus." };
  }
  if (!Number.isInteger(maxPlaetze) || maxPlaetze < 1) {
    return { error: "Bitte gib eine gültige Platzzahl an." };
  }

  const { data: meeting, error } = await supabase
    .from("meetings")
    .insert({
      creator_id: user.id,
      titel,
      sportart,
      datum: datumIso.toISOString(),
      ort,
      niveau,
      max_plaetze: maxPlaetze,
      beschreibung: beschreibung || null,
      ablauf: ablauf || null,
      erstie_freundlich: erstieFreundlich,
    })
    .select("id")
    .single();
  if (error || !meeting) {
    return { error: "Treffen konnte nicht angelegt werden. Bitte versuche es erneut." };
  }

  // Ersteller gilt automatisch als Teilnehmer.
  await supabase.from("participations").insert({
    meeting_id: meeting.id,
    user_id: user.id,
    kommt_allein: true,
  });

  revalidatePath("/treffen");
  redirect(`/treffen/${meeting.id}`);
}

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
