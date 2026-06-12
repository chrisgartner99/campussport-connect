"use client";

import { useActionState } from "react";
import { register } from "@/lib/actions/auth";
import FormInput from "@/components/forms/FormInput";
import FormError from "@/components/forms/FormError";
import SubmitButton from "@/components/forms/SubmitButton";

export default function RegisterForm() {
  const [state, formAction] = useActionState(register, null);

  return (
    <form action={formAction} className="space-y-4">
      <FormInput
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
      />
      <FormInput
        label="E-Mail"
        name="email"
        type="email"
        autoComplete="email"
        hint="Nutze am besten deine Hochschul-E-Mail, um Teil deiner Campus-Community zu werden."
        required
      />
      <FormInput
        label="Passwort"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={6}
        required
      />
      <FormError message={state?.error} />
      <SubmitButton>Konto erstellen</SubmitButton>
    </form>
  );
}
