"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { joinMeeting, leaveMeeting } from "@/lib/actions/meetings";
import FormError from "@/components/forms/FormError";

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
      <Link
        href="/login"
        className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Beitreten
      </Link>
    );
  }

  if (isParticipating) {
    return (
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
          ✓ Du bist dabei
        </p>
        <div>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await leaveMeeting(meetingId);
                setError(result?.error);
              })
            }
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-500 disabled:opacity-60"
          >
            {pending ? "Wird abgesagt …" : "Absagen"}
          </button>
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
        className="cursor-not-allowed rounded-md bg-zinc-300 px-4 py-2 text-sm font-medium text-white"
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
      <button
        type="button"
        onClick={() => setShowChoice(true)}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Beitreten
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium">Kommst du allein oder mit jemandem?</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => join(true)}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          Ich komme allein
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => join(false)}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-500 disabled:opacity-60"
        >
          Mit Begleitung
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setShowChoice(false)}
          className="px-2 py-2 text-sm text-zinc-500 hover:text-zinc-800"
        >
          Abbrechen
        </button>
      </div>
      <FormError message={error} />
    </div>
  );
}
