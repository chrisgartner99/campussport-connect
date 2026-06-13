import { createClient } from "@/lib/supabase/server";
import { conversationFilter, type Message } from "@/lib/conversation";

export type { Message };

/** Verlauf zwischen zwei Nutzern, chronologisch (server-seitig). */
export async function getConversation(
  userId: string,
  otherId: string
): Promise<Message[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, sender_id, empfaenger_id, inhalt, created_at")
    .or(conversationFilter(userId, otherId))
    .order("created_at", { ascending: true });
  return (data ?? []) as Message[];
}
