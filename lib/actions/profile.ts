"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AuthFormState } from "@/lib/actions/auth";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";

/** Liest und prüft die Profilfelder aus dem Formular. */
function parseProfileFields(formData: FormData):
  | { ok: true; semester: number; studiengang: string; sportarten: string[]; niveau: string }
  | { ok: false; error: string } {
  const semester = Number.parseInt(
    formData.get("semester")?.toString() ?? "",
    10
  );
  const studiengang = formData.get("studiengang")?.toString().trim() ?? "";
  const sportarten = formData
    .getAll("sportarten")
    .map(String)
    .filter((s) => (SPORTARTEN as readonly string[]).includes(s));
  const niveau = formData.get("niveau")?.toString() ?? "";

  if (!Number.isInteger(semester) || semester < 1 || semester > 10) {
    return { ok: false, error: "Bitte wähle dein Semester aus." };
  }
  if (!studiengang) {
    return { ok: false, error: "Bitte gib deinen Studiengang an." };
  }
  if (sportarten.length === 0) {
    return { ok: false, error: "Bitte wähle mindestens eine Sportart aus." };
  }
  if (!(NIVEAUS as readonly string[]).includes(niveau)) {
    return { ok: false, error: "Bitte wähle dein Niveau aus." };
  }
  return { ok: true, semester, studiengang, sportarten, niveau };
}

/**
 * Speichert das Onboarding-Ergebnis als Profil (anlegen oder
 * aktualisieren) und leitet Erstsemester (1./2. Semester) auf die
 * Erstie-Ansicht der Treffen-Übersicht weiter.
 */
export async function completeOnboarding(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const fields = parseProfileFields(formData);
  if (!fields.ok) {
    return { error: fields.error };
  }

  const name =
    user.user_metadata?.name?.toString().trim() ||
    user.email?.split("@")[0] ||
    "Unbekannt";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      name,
      studiengang: fields.studiengang,
      semester: fields.semester,
      sportarten: fields.sportarten,
      niveau: fields.niveau,
    },
    { onConflict: "id" }
  );
  if (error) {
    return { error: "Profil konnte nicht gespeichert werden. Bitte versuche es erneut." };
  }

  redirect(fields.semester <= 2 ? "/treffen?fokus=erstie" : "/treffen");
}

export type ProfileUpdateState =
  | { status: "success" }
  | { status: "error"; error: string }
  | null;

/**
 * Aktualisiert ein bestehendes Profil von der Profilseite aus.
 * Der Name kann hier ebenfalls geändert werden.
 */
export async function updateProfile(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  if (!name) {
    return { status: "error", error: "Bitte gib deinen Namen an." };
  }

  const fields = parseProfileFields(formData);
  if (!fields.ok) {
    return { status: "error", error: fields.error };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      studiengang: fields.studiengang,
      semester: fields.semester,
      sportarten: fields.sportarten,
      niveau: fields.niveau,
    })
    .eq("id", user.id);
  if (error) {
    return {
      status: "error",
      error: "Profil konnte nicht gespeichert werden. Bitte versuche es erneut.",
    };
  }

  revalidatePath("/profil");
  return { status: "success" };
}
