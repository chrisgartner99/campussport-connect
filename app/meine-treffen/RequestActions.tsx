"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { acceptRequest, rejectRequest } from "@/lib/actions/requests";
import FormError from "@/components/forms/FormError";
import Button from "@/components/ui/Button";

export default function RequestActions({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState<"angenommen" | "abgelehnt" | null>(null);

  const run = (
    fn: (id: string) => Promise<{ error: string } | null>,
    label: "angenommen" | "abgelehnt"
  ) =>
    startTransition(async () => {
      const result = await fn(requestId);
      if (result?.error) {
        setError(result.error);
      } else {
        setDone(label);
      }
    });

  // Kurze Quittung, bevor die Revalidierung den Eintrag entfernt.
  if (done) {
    const angenommen = done === "angenommen";
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
          angenommen
            ? "bg-success-soft text-on-success-soft"
            : "bg-surface-2 text-muted"
        }`}
      >
        {angenommen ? <Check size={15} aria-hidden /> : <X size={15} aria-hidden />}
        {angenommen ? "Angenommen – ihr seid jetzt verbunden" : "Abgelehnt"}
      </motion.p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          disabled={pending}
          onClick={() => run(acceptRequest, "angenommen")}
        >
          <Check size={15} aria-hidden />
          Annehmen
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => run(rejectRequest, "abgelehnt")}
        >
          <X size={15} aria-hidden />
          Ablehnen
        </Button>
      </div>
      <FormError message={error} />
    </div>
  );
}
