// Reine Chat-Helfer ohne Server-Abhängigkeiten – auch im Client nutzbar.

export type Message = {
  id: string;
  sender_id: string;
  empfaenger_id: string;
  inhalt: string;
  created_at: string;
};

/** PostgREST-Filter für den Nachrichtenverlauf zwischen zwei Nutzern. */
export function conversationFilter(a: string, b: string): string {
  return `and(sender_id.eq.${a},empfaenger_id.eq.${b}),and(sender_id.eq.${b},empfaenger_id.eq.${a})`;
}
