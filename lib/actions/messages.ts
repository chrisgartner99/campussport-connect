"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Markiert alle von `partnerId` erhaltenen Nachrichten als gelesen.
 * Wird beim Öffnen einer Konversation aufgerufen.
 */
export async function markConversationRead(partnerId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ gelesen: true })
    .eq("empfaenger_id", user.id)
    .eq("sender_id", partnerId)
    .eq("gelesen", false);

  // Badge im Header aktualisieren.
  revalidatePath("/", "layout");
}
