import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFriends } from "@/lib/friends";
import { getConversation } from "@/lib/messages";
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

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
        <p className="text-zinc-600">
          Schreibe mit deinen Freunden, um Treffen zu koordinieren.
        </p>
      </div>

      {friendList.length === 0 ? (
        <div className="space-y-4 rounded-lg border border-dashed border-zinc-300 px-6 py-10 text-center">
          <p className="text-zinc-600">
            Du kannst nur mit bestätigten Freunden chatten. Füge zuerst jemanden
            hinzu.
          </p>
          <Link
            href="/mitspieler"
            className="inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Mitspieler finden
          </Link>
        </div>
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
