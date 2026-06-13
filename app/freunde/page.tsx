import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircle, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFriends } from "@/lib/friends";
import { SportIcon } from "@/lib/sports";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";

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
        <h1 className="text-2xl font-extrabold tracking-tight">Freunde</h1>
        <p className="text-muted">Deine Kontakte aus angenommenen Anfragen.</p>
      </div>

      {friends.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Noch keine Freunde"
          description="Schick anderen Studierenden eine Anfrage – sobald sie annehmen, erscheinen sie hier."
          action={
            <Link href="/mitspieler" className={buttonClasses("primary", "md")}>
              Finde Mitspieler und schick eine Anfrage
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((f) => (
            <Card key={f.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={f.name} size="md" />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold leading-tight">{f.name}</h2>
                  <p className="truncate text-sm text-muted">
                    {f.semester ? `${f.semester}. Semester` : "—"}
                    {f.studiengang ? ` · ${f.studiengang}` : ""}
                  </p>
                </div>
              </div>

              {f.sportarten.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {f.sportarten.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink"
                    >
                      <SportIcon sportart={s} size={12} />
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-1">
                <Link
                  href={`/chat?mit=${f.id}`}
                  className={buttonClasses("primary", "sm", "w-full")}
                >
                  <MessageCircle size={15} aria-hidden />
                  Nachricht schreiben
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
