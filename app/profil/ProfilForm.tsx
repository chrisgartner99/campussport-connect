"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ProfileUpdateState } from "@/lib/actions/profile";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import FormInput from "@/components/forms/FormInput";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";

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
        <legend className="text-sm font-medium">Semester</legend>
        <div className="flex flex-wrap gap-2">
          {SEMESTER_OPTIONEN.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSemester(option)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                semester === option
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white hover:border-zinc-500"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Sportarten</legend>
        <div className="flex flex-wrap gap-2">
          {SPORTARTEN.map((sportart) => (
            <button
              key={sportart}
              type="button"
              onClick={() => toggleSportart(sportart)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                sportarten.includes(sportart)
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white hover:border-zinc-500"
              }`}
            >
              {sportart}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Niveau</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {NIVEAUS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setNiveau(option)}
              className={`rounded-md border px-4 py-3 text-sm ${
                niveau === option
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white hover:border-zinc-500"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
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
          className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
        >
          Profil gespeichert.
        </p>
      )}

      <div className="w-48">
        <SubmitButton>Änderungen speichern</SubmitButton>
      </div>
    </form>
  );
}
