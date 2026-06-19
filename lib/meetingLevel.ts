import type { BadgeTone } from "@/components/ui/Badge";

export type MeetingLevel = {
  label: "Anfängerfreundlich" | "Gemischt" | "Leistungsorientiert";
  tone: BadgeTone;
};

/**
 * Leitet aus erstie_freundlich + niveau eine klare Einstufung ab.
 * Kein neues Pflichtfeld – nutzt die vorhandenen Felder.
 */
export function meetingLevel(meeting: {
  erstie_freundlich: boolean;
  niveau: string | null;
}): MeetingLevel {
  if (meeting.erstie_freundlich) {
    return { label: "Anfängerfreundlich", tone: "success" };
  }
  if (meeting.niveau === "Fortgeschritten") {
    return { label: "Leistungsorientiert", tone: "warning" };
  }
  return { label: "Gemischt", tone: "blue" };
}
