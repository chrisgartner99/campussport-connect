import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Markiert den Chip als ausgewählt (z. B. Sportart-Auswahl). */
  selected?: boolean;
  children: ReactNode;
};

/** Anklickbarer Auswahl-Chip mit klarem Aktiv-Zustand. */
export default function Chip({
  selected = false,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "border-brand-strong bg-brand-strong text-on-brand"
          : "border-line bg-surface text-ink hover:border-brand"
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
