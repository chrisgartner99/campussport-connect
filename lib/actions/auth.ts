"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error: string } | null;

/** Übersetzt Supabase-Auth-Fehler in verständliche deutsche Meldungen. */
function germanAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "E-Mail oder Passwort ist falsch.";
  }
  if (message.includes("already registered")) {
    return "Diese E-Mail ist bereits registriert. Melde dich stattdessen an.";
  }
  if (message.includes("Password should be at least")) {
    return "Das Passwort muss mindestens 6 Zeichen lang sein.";
  }
  if (message.includes("valid email")) {
    return "Bitte gib eine gültige E-Mail-Adresse ein.";
  }
  if (message.includes("rate limit") || message.includes("Too many")) {
    return "Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.";
  }
  return "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.";
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: germanAuthError(error.message) };
  }

  redirect("/treffen");
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!name || !email || !password) {
    return { error: "Bitte alle Felder ausfüllen." };
  }

  const supabase = await createClient();
  // E-Mail-Bestätigung ist deaktiviert: signUp loggt direkt ein.
  // Der Name wandert in die user_metadata und wird im Onboarding
  // ins Profil übernommen.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) {
    return { error: germanAuthError(error.message) };
  }

  redirect("/onboarding");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
