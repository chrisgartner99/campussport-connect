import type { InputHTMLAttributes } from "react";
import { fieldClasses } from "@/components/ui/Input";

type Props = {
  label: string;
  name: string;
  /** Optionaler Hinweistext unter dem Eingabefeld. */
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ label, name, hint, className = "", ...rest }: Props) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input id={name} name={name} className={`${fieldClasses} ${className}`.trim()} {...rest} />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
