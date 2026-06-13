import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Freundlicher Leerzustand mit Icon-Illustration, Text und optionaler Aktion. */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center">
      <span
        aria-hidden
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-on-brand-soft"
      >
        {/* dezenter Ring als Akzentgrafik */}
        <span className="absolute inset-0 animate-none rounded-full ring-1 ring-brand/30" />
        <Icon size={28} />
      </span>
      <div className="space-y-1">
        <p className="text-base font-bold text-ink">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
