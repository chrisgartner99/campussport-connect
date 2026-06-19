import Link from "next/link";
import { Bell, Inbox, MessageCircle } from "lucide-react";
import type { NotificationCounts } from "@/lib/notifications";

/**
 * Glocke mit Zähler offener Anfragen + ungelesener Nachrichten.
 * Aufklappbares Menü (ohne Client-JS via <details>).
 */
export default function NotificationBell({
  counts,
}: {
  counts: NotificationCounts;
}) {
  const hat = counts.total > 0;

  return (
    <details className="relative">
      <summary className="relative flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-surface-2 hover:text-ink [&::-webkit-details-marker]:hidden">
        <span className="sr-only">
          Benachrichtigungen{hat ? `: ${counts.total} neu` : ""}
        </span>
        <Bell size={18} aria-hidden />
        {hat && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-accent">
            {counts.total > 9 ? "9+" : counts.total}
          </span>
        )}
      </summary>
      <div className="absolute right-0 z-40 mt-2 w-64 rounded-card border border-line bg-surface p-1.5 shadow-pop">
        <p className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          Benachrichtigungen
        </p>
        <Link
          href="/meine-treffen#anfragen"
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-surface-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-on-brand-soft">
            <Inbox size={16} aria-hidden />
          </span>
          <span className="flex-1 text-sm">
            <span className="block font-semibold text-ink">Offene Anfragen</span>
            <span className="text-muted">
              {counts.requests > 0
                ? `${counts.requests} warten auf dich`
                : "Keine offenen Anfragen"}
            </span>
          </span>
          {counts.requests > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">
              {counts.requests}
            </span>
          )}
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-surface-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-soft text-on-blue-soft">
            <MessageCircle size={16} aria-hidden />
          </span>
          <span className="flex-1 text-sm">
            <span className="block font-semibold text-ink">Neue Nachrichten</span>
            <span className="text-muted">
              {counts.messages > 0
                ? `${counts.messages} ungelesen`
                : "Alles gelesen"}
            </span>
          </span>
          {counts.messages > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">
              {counts.messages}
            </span>
          )}
        </Link>
      </div>
    </details>
  );
}
