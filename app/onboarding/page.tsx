import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("studiengang, semester, sportarten, niveau")
    .eq("id", user.id)
    .maybeSingle();

  const vorname = (
    user.user_metadata?.name?.toString() ??
    user.email?.split("@")[0] ??
    ""
  ).split(" ")[0];

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <h1 className="headline text-[clamp(1.9rem,5vw,2.75rem)]">
          Schön, dass du da bist{vorname ? `, ${vorname}` : ""}!
        </h1>
        <p className="text-muted">
          Erzähl uns kurz etwas über dich, damit wir dir passende
          Sporttreffen zeigen können.
        </p>
      </div>
      <Card>
        <OnboardingForm initial={profile} />
      </Card>
    </section>
  );
}
