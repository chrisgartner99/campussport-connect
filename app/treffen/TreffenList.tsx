"use client";

import { useMemo, useState } from "react";
import { Sparkles, SlidersHorizontal, CalendarSearch } from "lucide-react";
import type { MeetingWithStats } from "@/lib/meetings";
import { NIVEAUS } from "@/lib/constants";
import MeetingCard from "@/components/MeetingCard";
import { SportIcon } from "@/lib/sports";
import { fieldClasses } from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

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

  const labelClass = "flex flex-col gap-1 text-xs font-medium text-muted";

  return (
    <div className="space-y-6">
      {fokusErstie && (
        <div className="flex items-start gap-3 rounded-card border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-on-brand-soft">
          <Sparkles size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            {greeting ? (
              <>
                Schön, dass du da bist, {greeting.name}! Hier sind
                anfängerfreundliche {greeting.sportarten}Treffen, bei denen die
                meisten allein kommen.
              </>
            ) : (
              <>
                Schön, dass du dabei bist! Hier sind Treffen, bei denen die
                meisten allein kommen – du musst niemanden mitbringen.
              </>
            )}
          </p>
        </div>
      )}

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
              {sportarten.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Datum
            <select
              value={datum}
              onChange={(e) => setDatum(e.target.value as DatumFilter)}
              className={fieldClasses}
            >
              <option value="egal">Egal</option>
              <option value="heute">Heute</option>
              <option value="woche">Diese Woche</option>
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

          <label className={labelClass}>
            Ort
            <input
              type="text"
              value={ort}
              onChange={(e) => setOrt(e.target.value)}
              placeholder="z. B. Sontheim"
              className={fieldClasses}
            />
          </label>

          <label className="flex items-center gap-2 py-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={nurFreiePlaetze}
              onChange={(e) => setNurFreiePlaetze(e.target.checked)}
              className="accent-[var(--brand-strong)]"
            />
            Nur mit freien Plätzen
          </label>

          <label className="flex items-center gap-2 py-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={nurErstie}
              onChange={(e) => setNurErstie(e.target.checked)}
              className="accent-[var(--brand-strong)]"
            />
            Nur anfängerfreundlich
          </label>
        </div>

        {/* aktive Sportart als Icon-Hinweis */}
        {sportart && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-on-brand-soft">
            <SportIcon sportart={sportart} size={13} />
            {sportart}
          </div>
        )}
      </div>

      {gefiltert.length === 0 ? (
        <EmptyState
          icon={CalendarSearch}
          title="Keine Treffen gefunden"
          description="Zu diesen Filtern gibt es gerade kein Treffen. Setze ein paar Filter zurück oder schau später noch einmal vorbei."
        />
      ) : (
        <StaggerGroup className="grid gap-4 sm:grid-cols-2">
          {gefiltert.map((m, i) => (
            <StaggerItem
              key={m.id}
              className={i === 0 ? "h-full sm:col-span-2" : "h-full"}
            >
              <MeetingCard
                meeting={m}
                featured={i === 0}
                betoneAllein={nurErstie && m.erstie_freundlich}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
