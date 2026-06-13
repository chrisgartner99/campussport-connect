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
    titel: "Treffen finden",
    text: "Filtere nach Sportart, Ort und Niveau – viele Treffen sind ausdrücklich für Einsteiger.",
  },
  {
    titel: "Beitreten",
    text: "Sag verbindlich zu. Du musst niemanden mitbringen – die meisten kommen allein.",
  },
];

export default function HowItWorks() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <li
          key={step.titel}
          className="rounded-card border border-line bg-surface p-5 shadow-card"
        >
          <span className="headline block text-4xl text-brand-strong">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-lg font-extrabold">{step.titel}</h3>
          <p className="mt-1 text-sm text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
