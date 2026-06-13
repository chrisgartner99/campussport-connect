import { createClient } from "@/lib/supabase/server";
import { getUpcomingMeetings } from "@/lib/meetings";
import TreffenList from "./TreffenList";

/** Baut aus den Sportarten eine natürliche Aufzählung, z. B.
 *  "Badminton- und Volleyball-". Leer, wenn keine vorhanden. */
function sportartenPhrase(sportarten: string[]): string {
  if (sportarten.length === 0) return "";
  if (sportarten.length === 1) return `${sportarten[0]}-`;
  const head = sportarten.slice(0, -1).join("-, ");
  return `${head}- und ${sportarten[sportarten.length - 1]}-`;
}

export default async function TreffenPage({
  searchParams,
}: {
  searchParams: Promise<{ fokus?: string }>;
}) {
  const { fokus } = await searchParams;
  const fokusErstie = fokus === "erstie";
  const meetings = await getUpcomingMeetings();

  // Personalisierte Begrüßung für Erstis nach dem Onboarding.
  let greeting: { name: string; sportarten: string } | undefined;
  if (fokusErstie) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, sportarten")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.name) {
        greeting = {
          name: profile.name.split(" ")[0],
          sportarten: sportartenPhrase(profile.sportarten ?? []),
        };
      }
    }
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sporttreffen</h1>
        <p className="text-zinc-600">
          Finde ein Treffen, das zu dir passt, und mach einfach mit.
        </p>
      </div>
      <TreffenList
        meetings={meetings}
        fokusErstie={fokusErstie}
        greeting={greeting}
      />
    </section>
  );
}
