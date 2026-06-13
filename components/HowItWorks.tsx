const STEPS = [
  {
    titel: "Registrieren",
    text: "Melde dich mit deiner Hochschul-E-Mail an und werde Teil deiner Campus-Community.",
  },
  {
    titel: "Sportarten & Niveau wählen",
    text: "Sag uns im kurzen Onboarding, was dich interessiert und wie du dich einschätzt.",
  },
  {
    titel: "Anfängerfreundliches Treffen finden",
    text: "Filtere nach Sportart, Ort und Niveau – viele Treffen sind ausdrücklich für Einsteiger.",
  },
  {
    titel: "Beitreten",
    text: "Sag verbindlich zu. Du musst niemanden mitbringen – die meisten kommen allein.",
  },
];

export default function HowItWorks() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {STEPS.map((step, i) => (
        <li
          key={step.titel}
          className="flex gap-3 rounded-card border border-line bg-surface p-4 shadow-card"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-strong text-sm font-bold text-on-brand">
            {i + 1}
          </span>
          <div className="space-y-1">
            <h3 className="font-bold">{step.titel}</h3>
            <p className="text-sm text-muted">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
