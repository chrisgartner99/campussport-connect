"use client";

import { useState, useTransition } from "react";
import { acceptRequest, rejectRequest } from "@/lib/actions/requests";
import FormError from "@/components/forms/FormError";

export default function RequestActions({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const run = (fn: (id: string) => Promise<{ error: string } | null>) =>
    startTransition(async () => {
      const result = await fn(requestId);
      setError(result?.error);
    });

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(acceptRequest)}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          Annehmen
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(rejectRequest)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:border-zinc-500 disabled:opacity-60"
        >
          Ablehnen
        </button>
      </div>
      <FormError message={error} />
    </div>
  );
}
