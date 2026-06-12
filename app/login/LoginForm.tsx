"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import FormInput from "@/components/forms/FormInput";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <FormInput
        label="E-Mail"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <FormInput
        label="Passwort"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <FormError message={state?.error} />
      <SubmitButton>Anmelden</SubmitButton>
    </form>
  );
}
