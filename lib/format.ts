const dateFormat = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

const timeFormat = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Datum/Zeit eines Treffens, z. B. "Mo., 16.06. · 18:30 Uhr". */
export function formatMeetingDate(iso: string): string {
  const d = new Date(iso);
  return `${dateFormat.format(d)} · ${timeFormat.format(d)} Uhr`;
}
