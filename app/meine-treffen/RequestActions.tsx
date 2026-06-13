"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { acceptRequest, rejectRequest } from "@/lib/actions/requests";
import FormError from "@/components/forms/FormError";
import Button from "@/components/ui/Button";

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
        <Button variant="primary" size="sm" disabled={pending} onClick={() => run(acceptRequest)}>
          <Check size={15} aria-hidden />
          Annehmen
        </Button>
        <Button variant="ghost" size="sm" disabled={pending} onClick={() => run(rejectRequest)}>
          <X size={15} aria-hidden />
          Ablehnen
        </Button>
      </div>
      <FormError message={error} />
    </div>
  );
}
