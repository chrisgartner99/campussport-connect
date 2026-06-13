"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, UserMinus } from "lucide-react";
import { joinMeeting, leaveMeeting } from "@/lib/actions/meetings";
import FormError from "@/components/forms/FormError";
import Button, { buttonClasses } from "@/components/ui/Button";

type Props = {
  meetingId: string;
  isLoggedIn: boolean;
  isParticipating: boolean;
  isFull: boolean;
};

export default function JoinControls({
  meetingId,
  isLoggedIn,
  isParticipating,
  isFull,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [showChoice, setShowChoice] = useState(false);

  // Nicht eingeloggt: Beitreten leitet zum Login.
  if (!isLoggedIn) {
    return (
      <Link href="/login" className={buttonClasses("primary", "md")}>
        Beitreten
      </Link>
    );
  }

  if (isParticipating) {
    return (
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2 text-sm font-semibold text-on-success-soft">
          <Check size={16} aria-hidden />
          Du bist dabei
        </p>
        <div>
          <Button
            variant="ghost"
            loading={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await leaveMeeting(meetingId);
                setError(result?.error);
              })
            }
          >
            <UserMinus size={16} aria-hidden />
            Absagen
          </Button>
        </div>
        <FormError message={error} />
      </div>
    );
  }

  if (isFull) {
    return (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-lg bg-surface-2 px-5 py-2.5 text-sm font-semibold text-muted"
      >
        Treffen ist ausgebucht
      </button>
    );
  }

  const join = (kommtAllein: boolean) =>
    startTransition(async () => {
      const result = await joinMeeting(meetingId, kommtAllein);
      setError(result?.error);
      if (!result?.error) setShowChoice(false);
    });

  if (!showChoice) {
    return (
      <Button variant="primary" onClick={() => setShowChoice(true)}>
        Beitreten
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-card border border-line bg-surface p-4">
      <p className="text-sm font-semibold text-ink">
        Kommst du allein oder mit jemandem?
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" loading={pending} onClick={() => join(true)}>
          Ich komme allein
        </Button>
        <Button variant="ghost" disabled={pending} onClick={() => join(false)}>
          Mit Begleitung
        </Button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setShowChoice(false)}
          className="px-2 py-2 text-sm text-muted hover:text-ink"
        >
          Abbrechen
        </button>
      </div>
      <FormError message={error} />
    </div>
  );
}
