import { createClient } from "@/lib/supabase/server";

export type NotificationCounts = {
  requests: number;
  messages: number;
  total: number;
};

/** Zählt offene eingehende Anfragen und ungelesene Nachrichten. */
export async function getNotificationCounts(
  userId: string
): Promise<NotificationCounts> {
  const supabase = await createClient();

  const [{ count: reqCount }, { count: msgCount }] = await Promise.all([
    supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("empfaenger_id", userId)
      .eq("status", "offen"),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("empfaenger_id", userId)
      .eq("gelesen", false),
  ]);

  const requests = reqCount ?? 0;
  const messages = msgCount ?? 0;
  return { requests, messages, total: requests + messages };
}
