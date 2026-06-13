"use client";

import { useState, useTransition } from "react";
import { Check, UserPlus, SendHorizontal } from "lucide-react";
import { sendRequest } from "@/lib/actions/requests";
import FormError from "@/components/forms/FormError";
import Button, { buttonClasses } from "@/components/ui/Button";
import { fieldClasses } from "@/components/ui/Input";

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
      <p className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-success-soft px-3 py-2 text-sm font-semibold text-on-success-soft">
        <Check size={15} aria-hidden />
        Anfrage gesendet
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses("primary", "sm", "w-full")}
      >
        <UserPlus size={15} aria-hidden />
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
        className={fieldClasses}
      />
      <div className="flex gap-2">
        <Button variant="primary" size="sm" loading={pending} onClick={submit}>
          <SendHorizontal size={15} aria-hidden />
          Senden
        </Button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setOpen(false)}
          className="px-2 py-1.5 text-sm text-muted hover:text-ink"
        >
          Abbrechen
        </button>
      </div>
      <FormError message={error} />
    </div>
  );
}
