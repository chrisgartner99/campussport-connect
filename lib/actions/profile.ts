"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthFormState } from "@/lib/actions/auth";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";

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
    return { error: "Bitte wähle dein Semester aus." };
  }
  if (!studiengang) {
    return { error: "Bitte gib deinen Studiengang an." };
  }
  if (sportarten.length === 0) {
    return { error: "Bitte wähle mindestens eine Sportart aus." };
  }
  if (!(NIVEAUS as readonly string[]).includes(niveau)) {
    return { error: "Bitte wähle dein Niveau aus." };
  }

  const name =
    user.user_metadata?.name?.toString().trim() ||
    user.email?.split("@")[0] ||
    "Unbekannt";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      name,
      studiengang,
      semester,
      sportarten,
      niveau,
    },
    { onConflict: "id" }
  );
  if (error) {
    return { error: "Profil konnte nicht gespeichert werden. Bitte versuche es erneut." };
  }

  redirect(semester <= 2 ? "/treffen?fokus=erstie" : "/treffen");
}
