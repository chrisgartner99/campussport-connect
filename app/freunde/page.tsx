import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFriends } from "@/lib/friends";

export default async function FreundePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const friends = await getFriends(user.id);

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Freunde</h1>
        <p className="text-zinc-600">
          Deine Kontakte aus angenommenen Anfragen.
        </p>
      </div>

      {friends.length === 0 ? (
        <div className="space-y-4 rounded-lg border border-dashed border-zinc-300 px-6 py-10 text-center">
          <p className="text-zinc-600">
            Du hast noch keine Freunde hinzugefügt. Schick anderen
            Studierenden eine Anfrage – sobald sie annehmen, erscheinen sie
            hier.
          </p>
          <Link
            href="/mitspieler"
            className="inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Finde Mitspieler und schick eine Anfrage
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((f) => (
            <article
              key={f.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold leading-tight">
                  {f.name}
                </h2>
                <p className="text-sm text-zinc-500">
                  {f.semester ? `${f.semester}. Semester` : "—"}
                  {f.studiengang ? ` · ${f.studiengang}` : ""}
                </p>
              </div>

              {f.sportarten.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {f.sportarten.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-1">
                <Link
                  href={`/chat?mit=${f.id}`}
                  className="block w-full rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-zinc-700"
                >
                  Nachricht schreiben
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
