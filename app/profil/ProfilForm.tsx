"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ProfileUpdateState } from "@/lib/actions/profile";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import { SportIcon } from "@/lib/sports";
import FormInput from "@/components/forms/FormInput";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";
import Chip from "@/components/ui/Chip";
import NiveauHelp from "@/components/NiveauHelp";
import { CircleCheckBig } from "lucide-react";

const SEMESTER_OPTIONEN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

export type ProfilWerte = {
  name: string;
  studiengang: string;
  semester: number | null;
  sportarten: string[];
  niveau: string;
};

export default function ProfilForm({ initial }: { initial: ProfilWerte }) {
  const [semester, setSemester] = useState(
    initial.semester
      ? initial.semester >= 10
        ? "10+"
        : String(initial.semester)
      : ""
  );
  const [sportarten, setSportarten] = useState<string[]>(initial.sportarten);
  const [niveau, setNiveau] = useState(initial.niveau);
  const [state, formAction] = useActionState<ProfileUpdateState, FormData>(
    updateProfile,
    null
  );

  const toggleSportart = (sportart: string) =>
    setSportarten((prev) =>
      prev.includes(sportart)
        ? prev.filter((s) => s !== sportart)
        : [...prev, sportart]
    );

  return (
    <form action={formAction} className="space-y-6">
      <FormInput
        label="Name"
        name="name"
        type="text"
        defaultValue={initial.name}
        required
      />

      <FormInput
        label="Studiengang"
        name="studiengang"
        type="text"
        defaultValue={initial.studiengang}
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink">Semester</legend>
        <div className="flex flex-wrap gap-2">
          {SEMESTER_OPTIONEN.map((option) => (
            <Chip
              key={option}
              selected={semester === option}
              onClick={() => setSemester(option)}
              className="px-3"
            >
              {option}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink">Sportarten</legend>
        <div className="flex flex-wrap gap-2">
          {SPORTARTEN.map((sportart) => (
            <Chip
              key={sportart}
              selected={sportarten.includes(sportart)}
              onClick={() => toggleSportart(sportart)}
              className="inline-flex items-center gap-1.5"
            >
              <SportIcon sportart={sportart} size={14} />
              {sportart}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-ink">Niveau</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {NIVEAUS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setNiveau(option)}
              aria-pressed={niveau === option}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                niveau === option
                  ? "border-brand-strong bg-brand-strong text-on-brand"
                  : "border-line bg-surface text-ink hover:border-brand"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <NiveauHelp />
      </fieldset>

      <input type="hidden" name="semester" value={semester.replace("+", "")} />
      {sportarten.map((sportart) => (
        <input key={sportart} type="hidden" name="sportarten" value={sportart} />
      ))}
      <input type="hidden" name="niveau" value={niveau} />

      {state?.status === "error" && <FormError message={state.error} />}
      {state?.status === "success" && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-on-success-soft"
        >
          <CircleCheckBig size={16} aria-hidden />
          Profil gespeichert.
        </p>
      )}

      <div className="w-48">
        <SubmitButton>Änderungen speichern</SubmitButton>
      </div>
    </form>
  );
}
