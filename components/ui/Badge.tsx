import type { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "blue"
  | "success"
  | "warning"
  | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted",
  brand: "bg-brand-soft text-on-brand-soft",
  blue: "bg-blue-soft text-on-blue-soft",
  success: "bg-success-soft text-on-success-soft",
  warning: "bg-warning-soft text-on-warning-soft",
  danger: "bg-danger-soft text-on-danger-soft",
};

export default function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
