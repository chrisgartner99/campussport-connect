"use client";

import { useMemo, useState } from "react";
import type { MeetingWithStats } from "@/lib/meetings";
import { NIVEAUS } from "@/lib/constants";
import MeetingCard from "@/components/MeetingCard";

type DatumFilter = "egal" | "heute" | "woche";

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isThisWeek(iso: string): boolean {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return d >= now && d <= now + sevenDays;
}

export default function TreffenList({
  meetings,
  fokusErstie,
  greeting,
}: {
  meetings: MeetingWithStats[];
  fokusErstie: boolean;
  greeting?: { name: string; sportarten: string };
}) {
  const [sportart, setSportart] = useState("");
  const [datum, setDatum] = useState<DatumFilter>("egal");
  const [ort, setOrt] = useState("");
  const [niveau, setNiveau] = useState("");
  const [nurFreiePlaetze, setNurFreiePlaetze] = useState(false);
  const [nurErstie, setNurErstie] = useState(fokusErstie);

  // Sportarten-Dropdown aus den tatsächlich vorhandenen Treffen.
  const sportarten = useMemo(
    () => Array.from(new Set(meetings.map((m) => m.sportart))).sort(),
    [meetings]
  );

  const gefiltert = useMemo(() => {
    const liste = meetings.filter((m) => {
      if (sportart && m.sportart !== sportart) return false;
      if (niveau && m.niveau !== niveau) return false;
      if (datum === "heute" && !isToday(m.datum)) return false;
      if (datum === "woche" && !isThisWeek(m.datum)) return false;
      if (ort.trim() && !m.ort.toLowerCase().includes(ort.trim().toLowerCase()))
        return false;
      if (nurFreiePlaetze && m.freie_plaetze < 1) return false;
      if (nurErstie && !m.erstie_freundlich) return false;
      return true;
    });

    // Im Erstie-Fokus anfängerfreundliche Treffen zuerst zeigen
    // (Datums-Reihenfolge innerhalb der Gruppen bleibt erhalten).
    if (nurErstie) {
      return liste
        .map((m, i) => ({ m, i }))
        .sort((a, b) => {
          if (a.m.erstie_freundlich !== b.m.erstie_freundlich) {
            return a.m.erstie_freundlich ? -1 : 1;
          }
          return a.i - b.i;
        })
        .map((x) => x.m);
    }
    return liste;
  }, [meetings, sportart, niveau, datum, ort, nurFreiePlaetze, nurErstie]);

  const selectClass =
    "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

  return (
    <div className="space-y-6">
      {fokusErstie && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          {greeting ? (
            <>
              Schön, dass du da bist, {greeting.name}! Hier sind
              anfängerfreundliche {greeting.sportarten}Treffen, bei denen die
              meisten allein kommen.
            </>
          ) : (
            <>
              Schön, dass du dabei bist! Hier sind Treffen, bei denen die
              meisten allein kommen — du musst niemanden mitbringen.
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Sportart
          <select
            value={sportart}
            onChange={(e) => setSportart(e.target.value)}
            className={selectClass}
          >
            <option value="">Alle</option>
            {sportarten.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Datum
          <select
            value={datum}
            onChange={(e) => setDatum(e.target.value as DatumFilter)}
            className={selectClass}
          >
            <option value="egal">Egal</option>
            <option value="heute">Heute</option>
            <option value="woche">Diese Woche</option>
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

        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Ort
          <input
            type="text"
            value={ort}
            onChange={(e) => setOrt(e.target.value)}
            placeholder="z. B. Sontheim"
            className={selectClass}
          />
        </label>

        <label className="flex items-center gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={nurFreiePlaetze}
            onChange={(e) => setNurFreiePlaetze(e.target.checked)}
          />
          Nur mit freien Plätzen
        </label>

        <label className="flex items-center gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={nurErstie}
            onChange={(e) => setNurErstie(e.target.checked)}
          />
          Nur anfängerfreundlich
        </label>
      </div>

      {gefiltert.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
          Keine Treffen passen zu deinen Filtern.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {gefiltert.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              betoneAllein={nurErstie && m.erstie_freundlich}
            />
          ))}
        </div>
      )}
    </div>
  );
}
