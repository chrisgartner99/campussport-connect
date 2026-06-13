"use client";

import { useMemo, useState } from "react";
import type { ProfileCard } from "@/lib/profiles";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import RequestButton from "./RequestButton";

const selectClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

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
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Sportart
          <select
            value={sportart}
            onChange={(e) => setSportart(e.target.value)}
            className={selectClass}
          >
            <option value="">Alle</option>
            {SPORTARTEN.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Niveau
          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className={selectClass}
          >
            <option value="">Alle</option>
            {NIVEAUS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={nurNeu}
            onChange={(e) => setNurNeu(e.target.checked)}
          />
          Auch neu hier (1.–2. Semester)
        </label>
      </div>

      {gefiltert.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
          Keine Mitspieler passen zu deinen Filtern.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gefiltert.map((p) => (
            <article
              key={p.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold leading-tight">
                  {p.name}
                </h2>
                <p className="text-sm text-zinc-500">
                  {p.semester ? `${p.semester}. Semester` : "—"}
                  {p.studiengang ? ` · ${p.studiengang}` : ""}
                </p>
              </div>

              {p.sportarten.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.sportarten.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {p.niveau && (
                <p className="text-sm text-zinc-600">Niveau: {p.niveau}</p>
              )}

              <div className="mt-auto pt-1">
                <RequestButton
                  empfaengerId={p.id}
                  name={p.name}
                  alreadyRequested={requested.has(p.id)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
