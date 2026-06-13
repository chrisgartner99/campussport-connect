"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { conversationFilter, type Message } from "@/lib/conversation";
import Avatar from "@/components/ui/Avatar";

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
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const selectedFriend = friends.find((f) => f.id === selectedId) ?? null;

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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const inhalt = input.trim();
    if (!inhalt || !selectedId || sending) return;
    setSending(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: currentUserId, empfaenger_id: selectedId, inhalt })
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
      <aside className="hidden overflow-y-auto rounded-card border border-line bg-surface shadow-card sm:block">
        <ul className="divide-y divide-line">
          {friends.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                  f.id === selectedId ? "bg-brand-soft" : "hover:bg-surface-2"
                }`}
              >
                <Avatar name={f.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{f.name}</span>
                  <span className="block truncate text-sm text-muted">
                    {f.preview ?? "Noch keine Nachrichten"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile: kompakte Personenwahl */}
      <div className="sm:hidden">
        <label className="sr-only" htmlFor="chat-person">Person wählen</label>
        <select
          id="chat-person"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          {friends.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Nachrichtenverlauf */}
      <div className="flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
        {selectedFriend ? (
          <>
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <Avatar name={selectedFriend.name} size="sm" />
              <span className="font-semibold text-ink">{selectedFriend.name}</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto bg-base/40 p-4">
              {messages.length === 0 ? (
                <p className="pt-8 text-center text-sm text-muted">
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
                        className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm ${
                          eigen
                            ? "rounded-br-sm bg-brand-strong text-on-brand"
                            : "rounded-bl-sm bg-surface-2 text-ink"
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
              className="flex gap-2 border-t border-line p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nachricht schreiben …"
                className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Nachricht senden"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-strong text-on-brand transition-colors hover:opacity-90 disabled:opacity-55"
              >
                <SendHorizontal size={18} aria-hidden />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-muted">
            <MessageSquare size={28} aria-hidden />
            <p className="text-sm">Wähle links eine Person aus, um zu chatten.</p>
          </div>
        )}
      </div>
    </div>
  );
}
