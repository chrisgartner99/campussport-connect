import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfilForm from "./ProfilForm";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, studiengang, semester, sportarten, niveau")
    .eq("id", user.id)
    .maybeSingle();

  // Ohne Profil zurück ins Onboarding (greift normalerweise schon die
  // Middleware ab, hier als zusätzliche Absicherung).
  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Mein Profil</h1>
        <p className="text-zinc-600">
          Halte deine Angaben aktuell, damit wir dir passende Treffen zeigen.
        </p>
      </div>
      <ProfilForm
        initial={{
          name: profile.name ?? "",
          studiengang: profile.studiengang ?? "",
          semester: profile.semester ?? null,
          sportarten: profile.sportarten ?? [],
          niveau: profile.niveau ?? "",
        }}
      />
    </section>
  );
}
