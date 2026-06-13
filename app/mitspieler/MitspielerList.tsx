"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Sparkles, TrendingUp, UserSearch } from "lucide-react";
import type { ProfileCard } from "@/lib/profiles";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import { SportIcon } from "@/lib/sports";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { fieldClasses } from "@/components/ui/Input";
import RequestButton from "./RequestButton";

const labelClass = "flex flex-col gap-1 text-xs font-medium text-muted";

export default function MitspielerList({
  profiles,
  requestedIds,
}: {
  profiles: ProfileCard[];
  requestedIds: string[];
}) {
  const [sportart, setSportart] = useState("");
  const [niveau, setNiveau] = useState("");
  const [nurNeu, setNurNeu] = useState(false);

  const requested = useMemo(() => new Set(requestedIds), [requestedIds]);

  const gefiltert = useMemo(
    () =>
      profiles.filter((p) => {
        if (sportart && !p.sportarten.includes(sportart)) return false;
        if (niveau && p.niveau !== niveau) return false;
        if (nurNeu && !(p.semester && p.semester <= 2)) return false;
        return true;
      }),
    [profiles, sportart, niveau, nurNeu]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-line bg-surface p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal size={16} className="text-brand-strong" aria-hidden />
          Filter
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className={labelClass}>
            Sportart
            <select
              value={sportart}
              onChange={(e) => setSportart(e.target.value)}
              className={fieldClasses}
            >
              <option value="">Alle</option>
              {SPORTARTEN.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Niveau
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              className={fieldClasses}
            >
              <option value="">Alle</option>
              {NIVEAUS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 py-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={nurNeu}
              onChange={(e) => setNurNeu(e.target.checked)}
              className="accent-[var(--brand-strong)]"
            />
            Auch neu hier (1.–2. Semester)
          </label>
        </div>
      </div>

      {gefiltert.length === 0 ? (
        <EmptyState
          icon={UserSearch}
          title="Keine Mitspieler gefunden"
          description="Zu diesen Filtern passt gerade niemand. Lockere die Filter, um mehr Studierende zu sehen."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gefiltert.map((p) => {
            const istNeu = !!(p.semester && p.semester <= 2);
            return (
              <Card key={p.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} size="md" />
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold leading-tight">
                      {p.name}
                    </h2>
                    <p className="truncate text-sm text-muted">
                      {p.semester ? `${p.semester}. Semester` : "—"}
                      {p.studiengang ? ` · ${p.studiengang}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {istNeu && (
                    <Badge tone="success">
                      <Sparkles size={12} />
                      Neu hier
                    </Badge>
                  )}
                  {p.niveau && (
                    <Badge tone="neutral">
                      <TrendingUp size={12} />
                      {p.niveau}
                    </Badge>
                  )}
                </div>

                {p.sportarten.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.sportarten.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink"
                      >
                        <SportIcon sportart={s} size={12} />
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-1">
                  <RequestButton
                    empfaengerId={p.id}
                    name={p.name}
                    alreadyRequested={requested.has(p.id)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
