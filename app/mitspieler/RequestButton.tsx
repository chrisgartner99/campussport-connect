"use client";

import { useState, useTransition } from "react";
import { sendRequest } from "@/lib/actions/requests";
import FormError from "@/components/forms/FormError";

export default function RequestButton({
  empfaengerId,
  name,
  alreadyRequested,
}: {
  empfaengerId: string;
  name: string;
  alreadyRequested: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [gesendet, setGesendet] = useState(alreadyRequested);
  const [nachricht, setNachricht] = useState("");
  const [error, setError] = useState<string | undefined>();

  if (gesendet) {
    return (
      <p className="rounded-md bg-zinc-100 px-3 py-2 text-center text-sm font-medium text-zinc-600">
        Anfrage gesendet
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Anfragen
      </button>
    );
  }

  const submit = () =>
    startTransition(async () => {
      const result = await sendRequest(empfaengerId, nachricht);
      if (result?.error) {
        setError(result.error);
      } else {
        setGesendet(true);
      }
    });

  return (
    <div className="space-y-2">
      <textarea
        value={nachricht}
        onChange={(e) => setNachricht(e.target.value)}
        rows={2}
        placeholder={`Kurze Nachricht an ${name} …`}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Wird gesendet …" : "Senden"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setOpen(false)}
          className="px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-800"
        >
          Abbrechen
        </button>
      </div>
      <FormError message={error} />
    </div>
  );
}
