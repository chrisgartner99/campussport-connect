"use client";

import { useActionState, useState } from "react";
import { completeOnboarding } from "@/lib/actions/profile";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";

const SEMESTER_OPTIONEN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

type InitialProfile = {
  studiengang: string | null;
  semester: number | null;
  sportarten: string[] | null;
  niveau: string | null;
} | null;

const STEPS = [
  "Semester & Studiengang",
  "Sportarten",
  "Niveau",
] as const;

export default function OnboardingForm({
  initial,
}: {
  initial: InitialProfile;
}) {
  const [step, setStep] = useState(0);
  const [semester, setSemester] = useState(
    initial?.semester ? (initial.semester >= 10 ? "10+" : String(initial.semester)) : ""
  );
  const [studiengang, setStudiengang] = useState(initial?.studiengang ?? "");
  const [sportarten, setSportarten] = useState<string[]>(
    initial?.sportarten ?? []
  );
  const [niveau, setNiveau] = useState(initial?.niveau ?? "");
  const [state, formAction] = useActionState(completeOnboarding, null);

  const toggleSportart = (sportart: string) =>
    setSportarten((prev) =>
      prev.includes(sportart)
        ? prev.filter((s) => s !== sportart)
        : [...prev, sportart]
    );

  const stepValid =
    (step === 0 && semester !== "" && studiengang.trim() !== "") ||
    (step === 1 && sportarten.length > 0) ||
    (step === 2 && niveau !== "");

  return (
    <form action={formAction} className="space-y-6">
      {/* Fortschrittsanzeige */}
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">
          Schritt {step + 1} von {STEPS.length}: {STEPS[step]}
        </p>
        <div className="h-1.5 w-full rounded-full bg-zinc-200">
          <div
            className="h-1.5 rounded-full bg-zinc-900 transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="text-lg font-medium">
              In welchem Semester bist du?
            </legend>
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
          <div className="space-y-1">
            <label htmlFor="studiengang-input" className="text-lg font-medium">
              Was studierst du?
            </label>
            <input
              id="studiengang-input"
              type="text"
              value={studiengang}
              onChange={(e) => setStudiengang(e.target.value)}
              placeholder="z. B. Wirtschaftsinformatik"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">
            Welche Sportarten interessieren dich?
          </legend>
          <p className="text-sm text-zinc-500">
            Wähle alles aus, worauf du Lust hast – du kannst es später ändern.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
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
      )}

      {step === 2 && (
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">
            Wie schätzt du dein Niveau ein?
          </legend>
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
          <p className="text-sm text-zinc-500">
            Keine Sorge, viele Treffen sind ausdrücklich anfängerfreundlich.
          </p>
        </fieldset>
      )}

      {/* Gesammelte Werte für die Server Action */}
      <input type="hidden" name="semester" value={semester.replace("+", "")} />
      <input type="hidden" name="studiengang" value={studiengang} />
      {sportarten.map((sportart) => (
        <input key={sportart} type="hidden" name="sportarten" value={sportart} />
      ))}
      <input type="hidden" name="niveau" value={niveau} />

      <FormError message={state?.error} />

      <div className="flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:border-zinc-500"
          >
            Zurück
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!stepValid}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Weiter
          </button>
        ) : (
          <div className="w-40">
            <SubmitButton>Los geht&apos;s!</SubmitButton>
          </div>
        )}
      </div>
    </form>
  );
}
