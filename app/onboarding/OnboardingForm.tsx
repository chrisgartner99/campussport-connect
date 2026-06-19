"use client";

import { useActionState, useState } from "react";
import { completeOnboarding } from "@/lib/actions/profile";
import { NIVEAUS, SPORTARTEN } from "@/lib/constants";
import { SportIcon } from "@/lib/sports";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";
import Chip from "@/components/ui/Chip";
import { buttonClasses } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/Input";
import NiveauHelp from "@/components/NiveauHelp";

const SEMESTER_OPTIONEN = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

type InitialProfile = {
  studiengang: string | null;
  semester: number | null;
  sportarten: string[] | null;
  niveau: string | null;
} | null;

const STEPS = ["Semester & Studiengang", "Sportarten", "Niveau"] as const;

export default function OnboardingForm({ initial }: { initial: InitialProfile }) {
  const [step, setStep] = useState(0);
  const [semester, setSemester] = useState(
    initial?.semester ? (initial.semester >= 10 ? "10+" : String(initial.semester)) : ""
  );
  const [studiengang, setStudiengang] = useState(initial?.studiengang ?? "");
  const [sportarten, setSportarten] = useState<string[]>(initial?.sportarten ?? []);
  const [niveau, setNiveau] = useState(initial?.niveau ?? "");
  const [state, formAction] = useActionState(completeOnboarding, null);

  const toggleSportart = (sportart: string) =>
    setSportarten((prev) =>
      prev.includes(sportart) ? prev.filter((s) => s !== sportart) : [...prev, sportart]
    );

  const stepValid =
    (step === 0 && semester !== "" && studiengang.trim() !== "") ||
    (step === 1 && sportarten.length > 0) ||
    (step === 2 && niveau !== "");

  return (
    <form action={formAction} className="space-y-6">
      {/* Fortschrittsanzeige */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">
          Schritt {step + 1} von {STEPS.length}: {STEPS[step]}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-2 rounded-full bg-brand-strong transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="text-lg font-bold">In welchem Semester bist du?</legend>
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
          <div className="space-y-1.5">
            <label htmlFor="studiengang-input" className="text-lg font-bold">
              Was studierst du?
            </label>
            <input
              id="studiengang-input"
              type="text"
              value={studiengang}
              onChange={(e) => setStudiengang(e.target.value)}
              placeholder="z. B. Wirtschaftsinformatik"
              className={fieldClasses}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <fieldset className="space-y-2">
          <legend className="text-lg font-bold">
            Welche Sportarten interessieren dich?
          </legend>
          <p className="text-sm text-muted">
            Wähle alles aus, worauf du Lust hast – du kannst es später ändern.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
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
      )}

      {step === 2 && (
        <fieldset className="space-y-2">
          <legend className="text-lg font-bold">Wie schätzt du dein Niveau ein?</legend>
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
          <p className="text-sm text-muted">
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
            className={buttonClasses("ghost", "md")}
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
            className={buttonClasses("primary", "md")}
          >
            Weiter
          </button>
        ) : (
          <div className="w-44">
            <SubmitButton>Los geht&apos;s!</SubmitButton>
          </div>
        )}
      </div>
    </form>
  );
}
