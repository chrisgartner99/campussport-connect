"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type RequestState = { error: string } | null;

/**
 * Sendet eine Kontaktanfrage an eine andere Person. Verhindert
 * doppelte offene Anfragen an dieselbe Person.
 */
export async function sendRequest(
  empfaengerId: string,
  nachricht: string
): Promise<RequestState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  if (empfaengerId === user.id) {
    return { error: "Du kannst dir nicht selbst eine Anfrage senden." };
  }

  // Schon eine offene Anfrage an diese Person?
  const { count } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .eq("sender_id", user.id)
    .eq("empfaenger_id", empfaengerId)
    .eq("status", "offen");
  if ((count ?? 0) > 0) {
    return { error: "Du hast bereits eine offene Anfrage an diese Person." };
  }

  const { error } = await supabase.from("requests").insert({
    sender_id: user.id,
    empfaenger_id: empfaengerId,
    nachricht: nachricht.trim() || null,
    status: "offen",
  });
  if (error) {
    return { error: "Anfrage konnte nicht gesendet werden. Bitte versuche es erneut." };
  }

  revalidatePath("/mitspieler");
  revalidatePath("/meine-treffen");
  return null;
}

/** Beantwortet eine erhaltene Anfrage (nur der Empfänger). */
async function respondToRequest(
  requestId: string,
  status: "angenommen" | "abgelehnt"
): Promise<RequestState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // RLS lässt nur den Empfänger updaten; der Filter macht es explizit.
  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", requestId)
    .eq("empfaenger_id", user.id);
  if (error) {
    return { error: "Aktion fehlgeschlagen. Bitte versuche es erneut." };
  }

  revalidatePath("/meine-treffen");
  revalidatePath("/freunde");
  return null;
}

export async function acceptRequest(requestId: string): Promise<RequestState> {
  // Status 'angenommen' löst den friendship-Trigger aus Schritt 2 aus.
  return respondToRequest(requestId, "angenommen");
}

export async function rejectRequest(requestId: string): Promise<RequestState> {
  return respondToRequest(requestId, "abgelehnt");
}
