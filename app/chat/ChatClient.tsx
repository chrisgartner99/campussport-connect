"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { conversationFilter, type Message } from "@/lib/conversation";

type Friend = { id: string; name: string; preview: string | null };

export default function ChatClient({
  currentUserId,
  friends,
  initialSelectedId,
  initialMessages,
}: {
  currentUserId: string;
  friends: Friend[];
  initialSelectedId: string | null;
  initialMessages: Message[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const selectedFriend = friends.find((f) => f.id === selectedId) ?? null;

  // Verlauf laden, wenn eine andere Person ausgewählt wird.
  useEffect(() => {
    if (!selectedId) return;
    let aktiv = true;
    supabase
      .from("messages")
      .select("id, sender_id, empfaenger_id, inhalt, created_at")
      .or(conversationFilter(currentUserId, selectedId))
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (aktiv) setMessages((data ?? []) as Message[]);
      });
    return () => {
      aktiv = false;
    };
  }, [selectedId, currentUserId, supabase]);

  // Realtime: eingehende Nachrichten an mich live anhängen.
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `empfaenger_id=eq.${currentUserId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          // Nur anhängen, wenn sie zur offenen Konversation gehört.
          if (msg.sender_id === selectedId) {
            setMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId, selectedId]);

  // Ans Ende scrollen, wenn neue Nachrichten ankommen.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const inhalt = input.trim();
    if (!inhalt || !selectedId || sending) return;
    setSending(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUserId,
        empfaenger_id: selectedId,
        inhalt,
      })
      .select("id, sender_id, empfaenger_id, inhalt, created_at")
      .single();
    setSending(false);
    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setInput("");
    }
  };

  return (
    <div className="grid h-[70vh] grid-cols-1 gap-4 sm:grid-cols-[260px_1fr]">
      {/* Konversationsliste */}
      <aside className="overflow-y-auto rounded-lg border border-zinc-200 bg-white">
        <ul className="divide-y divide-zinc-100">
          {friends.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={`w-full px-4 py-3 text-left hover:bg-zinc-50 ${
                  f.id === selectedId ? "bg-zinc-100" : ""
                }`}
              >
                <span className="block font-medium">{f.name}</span>
                <span className="block truncate text-sm text-zinc-500">
                  {f.preview ?? "Noch keine Nachrichten"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Nachrichtenverlauf */}
      <div className="flex flex-col rounded-lg border border-zinc-200 bg-white">
        {selectedFriend ? (
          <>
            <div className="border-b border-zinc-200 px-4 py-3 font-medium">
              {selectedFriend.name}
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-zinc-400">
                  Schreib die erste Nachricht.
                </p>
              ) : (
                messages.map((m) => {
                  const eigen = m.sender_id === currentUserId;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${eigen ? "justify-end" : "justify-start"}`}
                    >
                      <span
                        className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                          eigen
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-900"
                        }`}
                      >
                        {m.inhalt}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2 border-t border-zinc-200 p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nachricht schreiben …"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
              >
                Senden
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-zinc-500">
            Wähle links eine Person aus, um zu chatten.
          </div>
        )}
      </div>
    </div>
  );
}
