import { createClient } from "@/lib/supabase/server";
import { getOtherProfiles, getOpenRequestTargets } from "@/lib/profiles";
import MitspielerList from "./MitspielerList";

export default async function MitspielerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profiles = user ? await getOtherProfiles(user.id) : [];
  const requestedIds = user
    ? Array.from(await getOpenRequestTargets(user.id))
    : [];

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Mitspieler</h1>
        <p className="text-zinc-600">
          Finde Studierende mit ähnlichen Interessen und schreib sie an.
        </p>
      </div>
      <MitspielerList profiles={profiles} requestedIds={requestedIds} />
    </section>
  );
}
