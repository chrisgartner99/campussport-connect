const NIVEAU_ERKLAERUNG = [
  { stufe: "Anfänger", text: "wenig oder keine Erfahrung, willst entspannt reinkommen" },
  { stufe: "Mittel", text: "spielst ab und zu, Grundlagen sitzen" },
  { stufe: "Fortgeschritten", text: "trainierst regelmäßig und sicher" },
];

/** Kurze Erklärung der Niveau-Stufen (Onboarding, Profil, Treffen erstellen). */
export default function NiveauHelp() {
  return (
    <ul className="space-y-0.5 text-xs text-muted">
      {NIVEAU_ERKLAERUNG.map((n) => (
        <li key={n.stufe}>
          <span className="font-semibold text-ink">{n.stufe}:</span> {n.text}
        </li>
      ))}
    </ul>
  );
}
