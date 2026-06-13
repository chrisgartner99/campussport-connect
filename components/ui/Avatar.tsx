// Tönungen aus dem Token-Set (alle Paare erfüllen AA in beiden Modi).
const palettes = [
  "bg-brand-soft text-on-brand-soft",
  "bg-blue-soft text-on-blue-soft",
  "bg-success-soft text-on-success-soft",
  "bg-warning-soft text-on-warning-soft",
];

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Initialen-Kreis. Die Farbe wird stabil aus dem Namen abgeleitet. */
export default function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: keyof typeof sizes;
}) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % palettes.length;

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${palettes[hash]} ${sizes[size]}`}
    >
      {initials(name)}
    </span>
  );
}
