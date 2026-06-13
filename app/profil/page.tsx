import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
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
        <h1 className="headline text-[clamp(1.9rem,5vw,2.75rem)]">Mein Profil</h1>
        <p className="text-muted">
          Halte deine Angaben aktuell, damit wir dir passende Treffen zeigen.
        </p>
      </div>
      <Card>
        <ProfilForm
          initial={{
            name: profile.name ?? "",
            studiengang: profile.studiengang ?? "",
            semester: profile.semester ?? null,
            sportarten: profile.sportarten ?? [],
            niveau: profile.niveau ?? "",
          }}
        />
      </Card>
    </section>
  );
}
