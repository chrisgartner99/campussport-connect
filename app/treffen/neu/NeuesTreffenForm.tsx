"use client";

import { useActionState } from "react";
import { createMeeting } from "@/lib/actions/meetings";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import FormInput from "@/components/forms/FormInput";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";

const selectClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export default function NeuesTreffenForm() {
  const [state, formAction] = useActionState(createMeeting, null);

  return (
    <form action={formAction} className="space-y-5">
      <FormInput label="Titel" name="titel" type="text" required />

      <div className="space-y-1">
        <label htmlFor="sportart" className="block text-sm font-medium">
          Sportart
        </label>
        <select id="sportart" name="sportart" className={selectClass} required>
          <option value="">Bitte wählen …</option>
          {SPORTARTEN.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Datum" name="datum" type="date" required />
        <FormInput label="Uhrzeit" name="uhrzeit" type="time" required />
      </div>

      <FormInput label="Ort" name="ort" type="text" required />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="niveau" className="block text-sm font-medium">
            Niveau
          </label>
          <select id="niveau" name="niveau" className={selectClass} required>
            <option value="">Bitte wählen …</option>
            {NIVEAUS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <FormInput
          label="Max. Plätze"
          name="max_plaetze"
          type="number"
          min={1}
          defaultValue={8}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="beschreibung" className="block text-sm font-medium">
          Beschreibung
        </label>
        <textarea
          id="beschreibung"
          name="beschreibung"
          rows={3}
          className={selectClass}
          placeholder="Worum geht es bei dem Treffen?"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="ablauf" className="block text-sm font-medium">
          Was erwartet dich
        </label>
        <textarea
          id="ablauf"
          name="ablauf"
          rows={3}
          className={selectClass}
          placeholder="Wie läuft das Treffen ab? Treffpunkt, Aufwärmen, Dauer …"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="erstie_freundlich" />
        Anfängerfreundlich (gut für Einsteiger und Erstsemester)
      </label>

      <FormError message={state?.error} />

      <div className="w-48">
        <SubmitButton>Treffen erstellen</SubmitButton>
      </div>
    </form>
  );
}
