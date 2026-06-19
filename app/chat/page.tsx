import Link from "next/link";
import { redirect } from "next/navigation";
import { MessagesSquare, Inbox, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFriends } from "@/lib/friends";
import { getConversation } from "@/lib/messages";
import { getNotificationCounts } from "@/lib/notifications";
import EmptyState from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import ChatClient from "./ChatClient";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ mit?: string }>;
}) {
  const { mit } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const friends = await getFriends(user.id);

  // Letzte Nachricht je Konversation als Vorschau.
  const { data: recent } = await supabase
    .from("messages")
    .select("sender_id, empfaenger_id, inhalt, created_at")
    .or(`sender_id.eq.${user.id},empfaenger_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const previews = new Map<string, string>();
  for (const m of recent ?? []) {
    const other = m.sender_id === user.id ? m.empfaenger_id : m.sender_id;
    if (!previews.has(other)) previews.set(other, m.inhalt);
  }

  const friendList = friends.map((f) => ({
    id: f.id,
    name: f.name,
    preview: previews.get(f.id) ?? null,
  }));

  // Auswahl: ?mit= (nur wenn befreundet), sonst erste Person.
  const requested =
    mit && friends.some((f) => f.id === mit) ? mit : null;
  const selectedId = requested ?? friendList[0]?.id ?? null;
  const initialMessages = selectedId
    ? await getConversation(user.id, selectedId)
    : [];

  const { requests: offeneAnfragen } = await getNotificationCounts(user.id);

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="headline text-[clamp(2rem,5vw,3rem)]">Chat</h1>
        <p className="text-muted">
          Schreibe mit deinen Freunden, um Treffen zu koordinieren.
        </p>
      </div>

      {/* Anfragen sind nicht hier, sondern unter "Meine Treffen" – klar verlinken. */}
      {offeneAnfragen > 0 && (
        <Link
          href="/meine-treffen#anfragen"
          className="flex items-center gap-3 rounded-card border border-brand/30 bg-brand-soft px-4 py-3 text-on-brand-soft transition-colors hover:border-brand/60"
        >
          <Inbox size={20} className="shrink-0" aria-hidden />
          <span className="flex-1 text-sm font-semibold">
            Du hast {offeneAnfragen} offene{" "}
            {offeneAnfragen === 1 ? "Anfrage" : "Anfragen"}. Anfragen findest du
            unter „Meine Treffen“.
          </span>
          <ArrowRight size={16} className="shrink-0" aria-hidden />
        </Link>
      )}

      {friendList.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="Noch keine Chats"
          description="Du kannst nur mit bestätigten Freunden chatten. Füge zuerst jemanden hinzu."
          action={
            <Link href="/mitspieler" className={buttonClasses("primary", "md")}>
              Mitspieler finden
            </Link>
          }
        />
      ) : (
        <ChatClient
          currentUserId={user.id}
          friends={friendList}
          initialSelectedId={selectedId}
          initialMessages={initialMessages}
        />
      )}
    </section>
  );
}
