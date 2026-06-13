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
          className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-4"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
            {i + 1}
          </span>
          <div className="space-y-1">
            <h3 className="font-semibold">{step.titel}</h3>
            <p className="text-sm text-zinc-600">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
