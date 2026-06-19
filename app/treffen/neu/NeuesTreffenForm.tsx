"use client";

import { useActionState } from "react";
import {
  Type,
  CalendarDays,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import { createMeeting } from "@/lib/actions/meetings";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";
import { fieldClasses } from "@/components/ui/Input";
import NiveauHelp from "@/components/NiveauHelp";

const labelClass = "flex items-center gap-1.5 text-sm font-semibold text-ink";

export default function NeuesTreffenForm() {
  const [state, formAction] = useActionState(createMeeting, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="titel" className={labelClass}>
          <Type size={15} className="text-brand-strong" aria-hidden />
          Titel
        </label>
        <input id="titel" name="titel" type="text" className={fieldClasses} required />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sportart" className={labelClass}>
          <Sparkles size={15} className="text-brand-strong" aria-hidden />
          Sportart
        </label>
        <select id="sportart" name="sportart" className={fieldClasses} required>
          <option value="">Bitte wählen …</option>
          {SPORTARTEN.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="datum" className={labelClass}>
            <CalendarDays size={15} className="text-brand-strong" aria-hidden />
            Datum
          </label>
          <input id="datum" name="datum" type="date" className={fieldClasses} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="uhrzeit" className={labelClass}>
            <Clock size={15} className="text-brand-strong" aria-hidden />
            Uhrzeit
          </label>
          <input id="uhrzeit" name="uhrzeit" type="time" className={fieldClasses} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ort" className={labelClass}>
          <MapPin size={15} className="text-brand-strong" aria-hidden />
          Ort
        </label>
        <input id="ort" name="ort" type="text" className={fieldClasses} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="niveau" className={labelClass}>
            <TrendingUp size={15} className="text-brand-strong" aria-hidden />
            Niveau
          </label>
          <select id="niveau" name="niveau" className={fieldClasses} required>
            <option value="">Bitte wählen …</option>
            {NIVEAUS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <NiveauHelp />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="max_plaetze" className={labelClass}>
            <Users size={15} className="text-brand-strong" aria-hidden />
            Max. Plätze
          </label>
          <input
            id="max_plaetze"
            name="max_plaetze"
            type="number"
            min={1}
            defaultValue={8}
            className={fieldClasses}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="beschreibung" className={labelClass}>
          Beschreibung
        </label>
        <textarea
          id="beschreibung"
          name="beschreibung"
          rows={3}
          className={fieldClasses}
          placeholder="Worum geht es bei dem Treffen?"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ablauf" className={labelClass}>
          Was erwartet dich
        </label>
        <textarea
          id="ablauf"
          name="ablauf"
          rows={3}
          className={fieldClasses}
          placeholder="Wie läuft das Treffen ab? Treffpunkt, Aufwärmen, Dauer …"
        />
      </div>

      <label className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2.5 text-sm text-ink">
        <input
          type="checkbox"
          name="erstie_freundlich"
          className="accent-[var(--brand-strong)]"
        />
        <Sparkles size={15} className="text-on-brand-soft" aria-hidden />
        Anfängerfreundlich (gut für Einsteiger und Erstsemester)
      </label>

      <FormError message={state?.error} />

      <div className="w-52">
        <SubmitButton>Treffen erstellen</SubmitButton>
      </div>
    </form>
  );
}
