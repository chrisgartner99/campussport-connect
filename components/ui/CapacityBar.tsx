import { Users } from "lucide-react";

/** Visuelle Belegungsanzeige: X von Y Plätzen belegt. */
export default function CapacityBar({
  belegt,
  max,
  tone = "light",
}: {
  belegt: number;
  max: number;
  /** "light" auf hellen Flächen, "dark" auf dunklen Farbblöcken. */
  tone?: "light" | "dark";
}) {
  const pct = max > 0 ? Math.min(100, Math.round((belegt / max) * 100)) : 0;
  const voll = belegt >= max;
  const dark = tone === "dark";

  return (
    <div className="space-y-1.5">
      <div className={`flex items-center justify-between text-sm font-semibold ${dark ? "text-white" : "text-ink"}`}>
        <span className="flex items-center gap-1.5">
          <Users size={15} className={dark ? "text-accent" : "text-brand-strong"} aria-hidden />
          {belegt} von {max} Plätzen belegt
        </span>
        <span className={voll ? (dark ? "text-white/70" : "text-danger") : dark ? "text-accent" : "text-brand-strong"}>
          {voll ? "ausgebucht" : `${max - belegt} frei`}
        </span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${dark ? "bg-white/20" : "bg-surface-2"}`}>
        <div
          className={`h-2 rounded-full ${voll ? (dark ? "bg-white/60" : "bg-danger") : dark ? "bg-accent" : "bg-brand-strong"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
